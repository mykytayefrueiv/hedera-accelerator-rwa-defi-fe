"use client";

import { FormInput } from "@/components/ui/formInput";
import { FormSelect } from "@/components/ui/formSelect";
import { SelectItem } from "@/components/ui/select";
import { useState } from "react";

export default function TooltipDemoPage() {
   const [inputValue, setInputValue] = useState("");
   const [selectValue, setSelectValue] = useState("");

   return (
      <div className="max-w-2xl mx-auto p-8 space-y-6">
         <h1 className="text-3xl font-bold mb-6">Tooltip Demo Page</h1>
         
         <div className="grid grid-cols-1 gap-6">
            <FormInput
               label="Building Title"
               name="buildingTitle"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               required
               tooltipContent="A descriptive name for your building that will be visible to all users and investors"
               placeholder="e.g. Central Plaza Tower"
            />

            <FormInput
               label="Building Token Supply"
               name="tokenSupply"
               type="number"
               tooltipContent="The total number of building tokens that will represent ownership. This determines how many shares the building can be divided into"
               placeholder="e.g. 1000000"
            />

            <FormInput
               label="Construction Materials"
               name="materials"
               tooltipContent="Primary building materials used in construction (e.g., Concrete, Steel, Wood frame). This affects durability and risk assessment"
               placeholder="e.g. Steel and Concrete"
            />

            <FormSelect
               label="Occupancy Type"
               name="occupancyType"
               value={selectValue}
               onValueChange={setSelectValue}
               required
               tooltipContent="How the building is used (e.g., Residential, Office, Retail, Industrial). This affects risk profile and rental income potential"
               placeholder="Select occupancy type"
            >
               <SelectItem value="residential">Residential</SelectItem>
               <SelectItem value="office">Office</SelectItem>
               <SelectItem value="retail">Retail</SelectItem>
               <SelectItem value="industrial">Industrial</SelectItem>
               <SelectItem value="mixed">Mixed-use</SelectItem>
            </FormSelect>

            <FormInput
               label="Regular Input (No Tooltip)"
               name="regular"
               placeholder="This input has no tooltip"
            />
         </div>
      </div>
   );
}