
import { getDB } from "@/lib/db";
import { HeadquartersUseCases } from "./headquarters";
import { UsersUseCases } from "./users";
import { ProceduresUseCases } from "./procedures";
import { RequestsUseCases } from "./requests";
import { NotificationsUseCases } from "./notifications";
import { DashboardUseCases } from "./dashboard";

class UseCaseFactory {
    private static _headquarters: HeadquartersUseCases;
    private static _users: UsersUseCases;
    private static _procedures: ProceduresUseCases;
    private static _requests: RequestsUseCases;
    private static _notifications: NotificationsUseCases;
    private static _dashboard: DashboardUseCases;

    static get headquarters(): HeadquartersUseCases {
        if (!this._headquarters) {
            this._headquarters = new HeadquartersUseCases(getDB());
        }
        return this._headquarters;
    }

    static get users(): UsersUseCases {
        if (!this._users) {
            this._users = new UsersUseCases(getDB());
        }
        return this._users;
    }

    static get procedures(): ProceduresUseCases {
        if (!this._procedures) {
            this._procedures = new ProceduresUseCases(getDB());
        }
        return this._procedures;
    }

    static get requests(): RequestsUseCases {
        if (!this._requests) {
            this._requests = new RequestsUseCases(getDB());
        }
        return this._requests;
    }

    static get notifications(): NotificationsUseCases {
        if (!this._notifications) {
            this._notifications = new NotificationsUseCases(getDB());
        }
        return this._notifications;
    }

    static get dashboard(): DashboardUseCases {
        if (!this._dashboard) {
            this._dashboard = new DashboardUseCases(getDB());
        }
        return this._dashboard;
    }
}

export const useCases = UseCaseFactory;
