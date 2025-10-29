// hooks/use-form-styles.ts
export const useFormStyles = () => {
  return {
    // Input styles matching your JobDetails component
    input:
      "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal",

    // Textarea styles
    textarea:
      "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal",

    // Select trigger styles
    selectTrigger:
      "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal",

    // Label styles
    label: "text-[#111418] text-base font-medium leading-normal pb-2",

    // Button styles
    buttons: {
      primary:
        "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#198754] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#198754]/90",
      secondary:
        "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0c77f2]/90",
      outline:
        "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300",
      preview:
        "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#2DD4BF] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2DD4BF]/90",
    },

    // Container styles
    container: "flex flex-col max-w-[960px] flex-1",
    header: "flex flex-wrap justify-between gap-3 p-4",
    title:
      "text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72",
    formContainer: "space-y-6",
    fieldContainer: "px-4",
  };
};
