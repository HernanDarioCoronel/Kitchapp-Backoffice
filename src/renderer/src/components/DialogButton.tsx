import { JSX, ReactNode } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'

interface DialogButtonProps {
  triggerButtonContent: ReactNode | string
  title: string
  description?: string
  type?: 'destructive' | 'default'
  onConfirm?: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
}

function DialogButton({
  triggerButtonContent,
  title,
  description,
  type = 'default',
  onConfirm,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}: DialogButtonProps): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">{triggerButtonContent}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>{cancelText}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={type}
              onClick={() => {
                try {
                  void onConfirm?.()
                } catch (e) {
                  // ignore - caller can handle errors
                }
              }}
            >
              {type === 'destructive' ? confirmText : 'Accept'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogButton
