"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, Plus, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { DebtForm } from "./debt-form"
import { PartialPaymentForm } from "./partial-payment-form"
import { useTranslations } from "@/hooks/use-translations"

export function DebtCard({
  debt,
  partialPayments = [],
  onUpdate,
  onDelete,
  onAddPartialPayment,
  onDeletePartialPayment,
}: any) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPartialPaymentOpen, setIsPartialPaymentOpen] = useState(false)
  const { t } = useTranslations()

  const totalPartialPayments = partialPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0)
  const remainingAmount = debt.amount - totalPartialPayments
  const paymentProgress = (totalPartialPayments / debt.amount) * 100

  const statusColor =
    debt.status === "pending"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
      : debt.status === "paid"
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"

  const statusText = debt.status === "pending" ? t("pending") : debt.status === "paid" ? t("paid") : t("received")

  return (
    <div className="border rounded-lg p-3 space-y-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{debt.description}</h4>
          <p className="text-sm text-muted-foreground">{debt.category}</p>
        </div>
        <div className="flex gap-1 ml-2 flex-shrink-0">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DebtForm
                initialData={debt}
                onSubmit={(data: any) => {
                  onUpdate(debt.id, data)
                  setIsEditOpen(false)
                }}
                onCancel={() => setIsEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="ghost" onClick={() => onDelete(debt.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Información de montos */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t("original.amount")}:</span>
          <span className="font-medium">${debt.amount.toLocaleString()}</span>
        </div>

        {totalPartialPayments > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("partial.paid")}:</span>
              <span className="font-medium text-blue-600">-${totalPartialPayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t("remaining")}:</span>
              <span className="font-bold text-lg">${remainingAmount.toLocaleString()}</span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(paymentProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {paymentProgress.toFixed(1)}% {debt.type === "payable" ? t("paid") : t("received")}
            </p>
          </>
        )}

        {totalPartialPayments === 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("amount")}:</span>
            <span className="font-bold text-lg">${debt.amount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {t("due")}: {format(new Date(debt.dueDate), "dd/MM/yyyy", { locale: es })}
        </span>
        <Badge className={statusColor}>{statusText}</Badge>
      </div>

      {/* Pagos parciales */}
      {partialPayments.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-3">
            <h5 className="text-sm font-medium mb-2">{t("partial.payments")}:</h5>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {partialPayments.map((payment: any) => (
                <div key={payment.id} className="flex justify-between items-center text-xs bg-background rounded p-2">
                  <div>
                    <span className="font-medium">${payment.amount.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">
                      {format(new Date(payment.date), "dd/MM/yyyy", { locale: es })}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeletePartialPayment(payment.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex gap-2">
        {debt.status === "pending" && remainingAmount > 0 && (
          <>
            <Dialog open={isPartialPaymentOpen} onOpenChange={setIsPartialPaymentOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Plus className="h-4 w-4 mr-1" />
                  {t("partial.payment")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <PartialPaymentForm
                  debt={debt}
                  remainingAmount={remainingAmount}
                  onSubmit={(data: any) => {
                    onAddPartialPayment({ ...data, debtId: debt.id })
                    setIsPartialPaymentOpen(false)
                  }}
                  onCancel={() => setIsPartialPaymentOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              variant="default"
              onClick={() =>
                onUpdate(debt.id, {
                  status: debt.type === "payable" ? "paid" : "received",
                })
              }
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              {t("mark.complete")}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
