"use client";

import { Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IVendorService } from "@/types"
import { deleteService } from "@/lib/actions/services"
import { useState } from "react"
import { toast } from "@/components/ui/toast"

export function DeleteServiceDialog({ service }: { service: IVendorService }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleDelete = async() => {
        const res = await deleteService(service._id as string);
        
        if (res.deletedCount) {
            setOpen(false);
            toast.add({
                title: "Service Deleted", 
                description: "The service has been permanently deleted.",
                type: "info",
            })
            router.refresh();
        }
    }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-stone-200 text-stone-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition cursor-pointer"
          >
            <Trash2Icon className="mr-2 h-3.5 w-3.5" />
            Delete
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete &quot;{service.serviceName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this wedding service? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
