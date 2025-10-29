"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GradResearch,
  GradResearchSchema,
} from "@/schemas/university/university-profile/grad-research-schema";

import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export default function GradResearchForm() {
  const form = useForm<GradResearch>({
    resolver: zodResolver(GradResearchSchema),
    defaultValues: {
      research: [
        {
          researchCenter: "",
          principalInvestigator: "",
          projectTitle: "",
          fundingSource: "",
          publishedPaperLink: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "research",
  });

  return (
    <div className="flex flex-col max-w-[960px] flex-1 mt-5">
      <Form {...form}>
        <form className="space-y-6">
          {/* Graduate Research */}
          <div className="space-y-4 px-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-600">
                    Graduate Research #{index + 1}
                  </h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`research.${index}.researchCenter`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray text-base font-medium leading-normal">
                        Research Center
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Computational Neuroscience Lab"
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`research.${index}.principalInvestigator`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray text-base font-medium leading-normal">
                        Principal Investigator
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Dr. Alan Turing"
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`research.${index}.projectTitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray text-base font-medium leading-normal">
                        Project Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Quantum Cryptography Protocols"
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`research.${index}.fundingSource`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray text-base font-medium leading-normal">
                        Funding Source (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., NSF Grant #123456"
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`research.${index}.publishedPaperLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray text-base font-medium leading-normal">
                        Published Paper Link (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., https://journals.example.com/paper123"
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  researchCenter: "",
                  principalInvestigator: "",
                  projectTitle: "",
                  fundingSource: "",
                  publishedPaperLink: "",
                })
              }
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Graduate Research
            </Button>
          </div>

          {/* Form Actions */}
          <div className="flex px-4 py-3 justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0c77f2]/90"
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#198754] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#198754]/90"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
