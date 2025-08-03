'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from 'react-hook-form';

interface RadioGroupSimNaoProps {
    name: string;
    label: string;
}

export function RadioGroupSimNao({ name, label }: RadioGroupSimNaoProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <div className="flex flex-col">
                    <FormItem className="space-y-2">
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={(value: string) => field.onChange(value === 'true')}
                                value={String(field.value)}
                                className="flex space-x-2"
                            >
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="true" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">Sim</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="false" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">Não</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>
            )}
        />
    );
}
