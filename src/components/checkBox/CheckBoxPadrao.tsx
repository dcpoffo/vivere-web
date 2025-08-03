'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { cn } from "@/lib/utils";

interface CampoBooleanoCheckboxProps {
    name: string;
    label: string;
}

export function CheckboxPadrao({ name, label }: CampoBooleanoCheckboxProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                    </FormControl>
                    <FormLabel
                        className={cn(
                            "text-sm font-medium",
                            field.value && "text-green-600"
                        )}
                    >
                        {label}
                    </FormLabel>
                    {/* <FormMessage /> */}
                </FormItem>
            )}
        />
    );
}
