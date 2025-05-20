"use client";

import { PaymentRequestPayload, useBuildingTreasury } from "@/hooks/useBuildingTreasury";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import { ExpenseForm } from "./ExpenseForm";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

type ExpensesViewProps = {
   buildingAddress: `0x${string}`;
};

type ExpensesModalProps = {
   open: boolean;
   buildingAddress: `0x${string}`;
   onOpenChange: (state: boolean) => void;
   handleExpenseSubmitted: (data: PaymentRequestPayload) => Promise<void>;
};

export const utils = {
   getExpenses: async () => {
      return !!localStorage.getItem('Expenses') ? JSON.parse(localStorage.getItem('Expenses') as string) : [];
   },
   saveExpenses: async (expenseData: PaymentRequestPayload) => {
      localStorage.setItem(
         'Expenses',
         JSON.stringify(
            [...(
               !!localStorage.getItem('Expenses') ? JSON.parse(localStorage.getItem('Expenses') as string) : []),
               expenseData,
            ]
         )
      );
   },
};

export function ExpensesView({ buildingAddress }: ExpensesViewProps) {
   const { data, expenses, isError, isLoading, makePayment } = useBuildingTreasury(buildingAddress);
   const [showModal, setShowModal] = useState(false);

   const onSubmitExpense = async (values: PaymentRequestPayload) => {
      try {
         await makePayment(values);
         utils.saveExpenses(values);

         toast.success("Expense payment made from the treasury!");
         setShowModal(false);
      } catch (err) {
         toast.error(`Could not make expense treasury payment: ${err}`);
      }
   }

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
               <p className="text-gray-500 text-base mt-1">
                  Submit and track building expenses paid from the treasury
               </p>
            </div>

            {data && (
               <div className="text-right">
                  <p className="text-gray-500 text-base">Treasury Balance</p>
                  <p className="text-2xl font-semibold">{data.balance.toLocaleString()} USDC</p>
               </div>
            )}
         </div>

         {/* Content */}
         <div className="bg-white rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Expenses History</h2>

            {isLoading && <p className="text-base text-gray-500">Loading expenses...</p>}
            {isError && <p className="text-base text-red-500">Error fetching expenses!</p>}

            {!isLoading && !isError && expenses.length === 0 ? (
               <p className="text-base text-gray-500">No expenses recorded yet.</p>
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Receiver</TableHead>
                        <TableHead>Notes</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {expenses?.map((expense) => (
                        <TableRow key={`${expense.amount}-${expense.receiver}`}>
                           <TableCell>
                              {moment(expense.dateCreated).format("YYYY-MM-DD HH:mm")}
                           </TableCell>
                           <TableCell>{expense.title}</TableCell>
                           <TableCell>{expense.amount} USDC</TableCell>
                           <TableCell>{expense.receiver}</TableCell>
                           <TableCell>{expense.notes || "No notes"}</TableCell>
                           <TableCell>
                              <Badge>Success</Badge>
                           </TableCell>
                           <TableCell>
                              <Button variant="outline" size="sm" type="button">
                                 Details
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            )}
         </div>

         {/* Footer */}
         <div className="flex justify-end">
            <Button type="button" onClick={() => setShowModal(true)}>
               Submit New Expense
            </Button>
         </div>

         <ExpenseModal
            open={showModal}
            buildingAddress={buildingAddress}
            onOpenChange={() => setShowModal(false)}
            handleExpenseSubmitted={onSubmitExpense}
         />
      </div>
   );
}

function ExpenseModal({
   open,
   onOpenChange,
   handleExpenseSubmitted,
}: ExpensesModalProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Add Building Expense</DialogTitle>
               <DialogDescription>
                  Submit an expense. If approved, a payment is made from the treasury.
               </DialogDescription>
            </DialogHeader>
            <ExpenseForm handlePayment={handleExpenseSubmitted} />
         </DialogContent>
      </Dialog>
   );
}
