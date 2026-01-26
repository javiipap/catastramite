import { Button } from "@/components/ui/button";
import { type Request } from '@/lib/types';
import { ActionType } from '@/app/(private)/master/[headquartersId]/requests/page';
import RequestDetailsDialog from "@/components/requests/request-details-dialog";

interface Props {
  selectedRequest: Request | null;
  setSelectedRequest: (request: Request | null) => void;
  handleActionClick: (request: Request, action: ActionType) => void;
}

export default function DetailsDialog({
  selectedRequest,
  setSelectedRequest,
  handleActionClick,
}: Props) {
  return (
    <RequestDetailsDialog
      request={selectedRequest}
      onClose={() => setSelectedRequest(null)}
    >
      {(selectedRequest?.status === "pending" || selectedRequest?.status === "in_review") && (
        <div className="flex gap-2">
          <Button
            onClick={() => selectedRequest && handleActionClick(selectedRequest, "approved")}
            className="flex-1"
          >
            Approve Request
          </Button>
          <Button
            variant="destructive"
            onClick={() => selectedRequest && handleActionClick(selectedRequest, "rejected")}
            className="flex-1"
          >
            Reject Request
          </Button>
        </div>
      )}
    </RequestDetailsDialog>
  )
}