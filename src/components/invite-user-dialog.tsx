
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateInvitationToken } from "@/lib/mutations/invitations";
import { Copy, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface InviteUserDialogProps {
  headquartersId: string;
  icon?: React.ReactNode;
  className?: string; // Add className prop
}

export function InviteUserDialog({ headquartersId, icon, className }: InviteUserDialogProps) {
  const [role, setRole] = useState("slave");
  const [inviteLink, setInviteLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending: isExecuting } = useCreateInvitationToken();

  const handleGenerate = async () => {
    try {
      const data = await mutateAsync({ headquartersId, role: role as "master" | "slave" });
      if (data) {
        const url = `${window.location.origin}/invitation?token=${data}`;
        setInviteLink(url);
      }
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied to clipboard");
  };

  const resetState = () => {
    setInviteLink("");
    setRole("slave");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetState();
    }}>
      <DialogTrigger asChild>
        <Button variant="secondary" className={className}>
          {icon ? icon :
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite user
            </>
          }
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Generate a unique link to invite a user to this headquarters.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={!!inviteLink}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slave">Slave (Member)</SelectItem>
                <SelectItem value="master">Master (Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inviteLink && (
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={inviteLink}
                  readOnly
                  className="h-9"
                />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          {!inviteLink ? (
            <Button onClick={handleGenerate} disabled={isExecuting}>
              {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Link
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
