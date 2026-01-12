import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  TransactWriteCommand,
  BatchGetCommand,
} from '@aws-sdk/lib-dynamodb';
import { DatabaseAdapter } from '../types';
import {
  Headquarters,
  UserHeadquarters,
  UserRole,
  Procedure,
  Request as AppRequest,
  Notification as AppNotification,
  FormField,
  RequestStatus,
} from '@/lib/types';

// Configuration from env or defaults
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Catastramite';
const REGION = process.env.AWS_REGION || 'us-east-1';

// Client initialization
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDBAdapter implements DatabaseAdapter {
  // --- Helpers for Key Generation ---

  private pk(type: string, id: string) {
    return `${type}#${id}`;
  }

  // --- Implementation ---

  async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: this.pk('USER', uh.userId),
        SK: this.pk('HQ', uh.headquartersId),
        GSI1PK: this.pk('HQ', uh.headquartersId), // For "Get HQ's Users" access pattern if needed
        GSI1SK: this.pk('USER', uh.userId),
        role: uh.role,
      },
      // Ensure idempotency / check existence if strict, but Put is fine here
    });

    await docClient.send(command);
  }

  // ... (Reads omitted/unchanged) ...

  async createHeadquarters(
    hq: Headquarters,
    userId: string
  ): Promise<Headquarters> {
    const command = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE_NAME,
            Item: {
              PK: this.pk('HQ', hq.headquartersId),
              SK: 'METADATA',
              GSI1PK: 'ALL_HQS',
              GSI1SK: this.pk('HQ', hq.headquartersId),
              name: hq.name,
              description: hq.description,
              createdAt: hq.createdAt.toISOString(),
            },
          },
        },
        {
          Put: {
            TableName: TABLE_NAME,
            Item: {
              PK: this.pk('USER', userId),
              SK: this.pk('HQ', hq.headquartersId),
              GSI1PK: this.pk('HQ', hq.headquartersId),
              GSI1SK: this.pk('USER', userId),
              role: 'master',
            },
          },
        },
      ],
    });

    await docClient.send(command);
    return hq;
  }

  async updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>
  ): Promise<Headquarters> {
    // Build Update Expression
    const expAttrValues: Record<string, any> = {};
    const expAttrNames: Record<string, string> = {};
    let updateExp = 'SET';

    if (updates.name) {
      updateExp += ' #n = :n,';
      expAttrValues[':n'] = updates.name;
      expAttrNames['#n'] = 'name';
    }
    if (updates.description) {
      updateExp += ' description = :d,';
      expAttrValues[':d'] = updates.description;
    }

    // Remove trailing comma
    updateExp = updateExp.slice(0, -1);

    // If no updates in relevant fields, fetch and return
    if (Object.keys(expAttrValues).length === 0) {
      const existing = await this.getHeadquartersById(id);
      if (!existing) throw new Error('Headquarters not found');
      return existing;
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: this.pk('HQ', id),
        SK: 'METADATA',
      },
      UpdateExpression: updateExp,
      ExpressionAttributeNames:
        Object.keys(expAttrNames).length > 0 ? expAttrNames : undefined,
      ExpressionAttributeValues: expAttrValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    return this.mapToHeadquarters(result.Attributes);
  }

  async createProcedure(procedure: Procedure): Promise<Procedure> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: this.pk('HQ', procedure.headquartersId),
        SK: this.pk('PROC', procedure.id),
        name: procedure.name,
        description: procedure.description,
        fields: procedure.fields,
        createdAt: procedure.createdAt.toISOString(),
        createdBy: procedure.createdBy,
      },
    });

    await docClient.send(command);
    return procedure;
  }

  async createRequest(request: AppRequest): Promise<AppRequest> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: this.pk('HQ', request.headquartersId),
        SK: this.pk('REQ', request.id),

        // GSI for User's Requests
        GSI1PK: this.pk('USER', request.applicantId),
        GSI1SK: this.pk('HQ', request.headquartersId) + '#REQ#' + request.id,

        procedureId: request.procedureId,
        procedureName: request.procedureName,
        applicantId: request.applicantId,
        applicantName: request.applicantName,
        status: request.status,
        data: request.data,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
      },
    });

    await docClient.send(command);
    return request;
  }

  async updateRequestStatus(
    id: string,
    status: RequestStatus,
    headquartersId: string
  ): Promise<AppRequest> {
    // We need to know the SK (REQ#{id}), assuming we don't need to query it first?
    // But update in DynamoDB requires full Key (PK + SK).
    // The interface passed id and headquartersId. Perfect, PK=HQ#{headquartersId}, SK=REQ#{id}.

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: this.pk('HQ', headquartersId),
        SK: this.pk('REQ', id),
      },
      UpdateExpression: 'SET #s = :s, updatedAt = :u',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':s': status,
        ':u': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    return this.mapToRequest(result.Attributes, headquartersId);
  }

  async createNotification(
    notification: AppNotification
  ): Promise<AppNotification> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: this.pk('HQ', notification.headquartersId),
        SK: this.pk('NOTIF', notification.id),
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        createdAt: notification.createdAt.toISOString(),
        createdBy: notification.createdBy,
      },
    });

    await docClient.send(command);
    return notification;
  }

  async getUserRole(userId: string, hqId: string): Promise<UserRole | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: this.pk('USER', userId),
        SK: this.pk('HQ', hqId),
      },
    });

    const result = await docClient.send(command);

    if (!result.Item) return null;
    return result.Item.role as UserRole;
  }

  async getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': this.pk('USER', userId),
        ':skPrefix': 'HQ#',
      },
    });

    const result = await docClient.send(command);
    if (!result.Items) return [];

    return result.Items.map((item) => ({
      userId,
      headquartersId: item.SK.split('#')[1],
      role: item.role as UserRole,
    }));
  }

  async getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
    const userHqs = await this.getUserHeadquarters(userId);
    if (userHqs.length === 0) return [];

    // Batch Get HQs
    const distinctHqIds = [...new Set(userHqs.map((uh) => uh.headquartersId))];
    const keys = distinctHqIds.map((id) => ({
      PK: this.pk('HQ', id),
      SK: 'METADATA',
    }));

    // Handle batch constraints (25 items max) in a real app, keeping simple here
    const command = new BatchGetCommand({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    });

    const result = await docClient.send(command);
    const items = result.Responses?.[TABLE_NAME] || [];

    return items.map(this.mapToHeadquarters).map((h) => ({
      ...h,
      userHeadquarters: userHqs.filter(
        (uh) => uh.headquartersId === h.headquartersId
      ),
    }));
  }

  async getHeadquartersById(id: string): Promise<Headquarters | undefined> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: this.pk('HQ', id),
        SK: 'METADATA',
      },
    });

    const result = await docClient.send(command);
    if (!result.Item) return undefined;

    return this.mapToHeadquarters(result.Item);
  }

  async getProcedures(hqId: string): Promise<Procedure[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': this.pk('HQ', hqId),
        ':skPrefix': 'PROC#',
      },
    });

    const result = await docClient.send(command);
    if (!result.Items) return [];

    return result.Items.map((item) => this.mapToProcedure(item, hqId));
  }

  async getRequests(hqId: string): Promise<AppRequest[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': this.pk('HQ', hqId),
        ':skPrefix': 'REQ#',
      },
    });

    const result = await docClient.send(command);
    if (!result.Items) return [];

    return result.Items.map((item) => this.mapToRequest(item, hqId));
  }

  async getUserRequests(hqId: string, userId: string): Promise<AppRequest[]> {
    // Current design: Query GSI1 for USER#{id} then filter or GSI with SK
    // In plan: GSI1PK = USER#{id}, GSI1SK = HQ#{hqId}#REQ#{id}

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression:
        'GSI1PK = :userPk AND begins_with(GSI1SK, :gsiSkPrefix)',
      ExpressionAttributeValues: {
        ':userPk': this.pk('USER', userId),
        ':gsiSkPrefix': this.pk('HQ', hqId) + '#REQ#',
      },
    });

    const result = await docClient.send(command);
    if (!result.Items) return [];

    return result.Items.map((item) => this.mapToRequest(item, hqId));
  }

  async getNotifications(hqId: string): Promise<AppNotification[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': this.pk('HQ', hqId),
        ':skPrefix': 'NOTIF#',
      },
    });

    const result = await docClient.send(command);
    if (!result.Items) return [];

    return result.Items.map((item) => this.mapToNotification(item, hqId));
  }

  // --- Mappers ---

  private mapToHeadquarters(item: any): Headquarters {
    return {
      headquartersId: item.PK.split('#')[1],
      name: item.name,
      description: item.description,
      createdAt: new Date(item.createdAt),
      // UserHeadquarters are fetched separately or not included in base object
    };
  }

  private mapToProcedure(item: any, hqId: string): Procedure {
    return {
      id: item.SK.split('#')[1],
      headquartersId: hqId,
      name: item.name,
      description: item.description,
      fields: item.fields as FormField[],
      createdAt: new Date(item.createdAt),
      createdBy: item.createdBy,
    };
  }

  private mapToRequest(item: any, hqId: string): AppRequest {
    return {
      id: item.SK.split('#')[1],
      headquartersId: hqId,
      procedureId: item.procedureId,
      procedureName: item.procedureName,
      applicantId: item.applicantId,
      applicantName: item.applicantName,
      status: item.status,
      data: item.data,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    };
  }

  private mapToNotification(item: any, hqId: string): AppNotification {
    return {
      id: item.SK.split('#')[1],
      headquartersId: hqId,
      title: item.title,
      message: item.message,
      priority: item.priority,
      createdAt: new Date(item.createdAt),
      createdBy: item.createdBy,
    };
  }
}
