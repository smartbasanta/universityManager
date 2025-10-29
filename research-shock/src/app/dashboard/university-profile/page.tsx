"use client";

import { UniversityProfileForm } from "@/components/form/university-profile";
import { UniversityProfile } from "@/schemas/university/university-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function UniversityProfilePage() {
  const [hasGraduateProgram, setHasGraduateProgram] = useState(false);
  const [activeTab, setActiveTab] = useState("undergraduate");

  const handleUndergraduateSubmit = (values: UniversityProfile) => {
    console.log("Undergraduate Program:", values);
  };

  const handleGraduateSubmit = (values: UniversityProfile) => {
    console.log("Graduate Program:", values);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Header with title and toggle */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold ">University Profile</h1>
            <div className="flex items-center space-x-3">
              <Label
                htmlFor="graduate-program"
                className="text-sm font-medium text-muted-foreground"
              >
                Graduate Program Available
              </Label>
              <Switch
                id="graduate-program"
                checked={hasGraduateProgram}
                onCheckedChange={setHasGraduateProgram}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Program Selection */}
          {hasGraduateProgram ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-muted p-1 h-auto">
                <TabsTrigger
                  value="undergraduate"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 rounded-md"
                >
                  Undergraduate Program
                </TabsTrigger>
                <TabsTrigger
                  value="graduate"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 rounded-md"
                >
                  Graduate Program
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="undergraduate">
                  <UniversityProfileForm
                    program="undergraduate"
                    onSubmit={handleUndergraduateSubmit}
                    key="undergrad-form"
                  />
                </TabsContent>
                <TabsContent value="graduate">
                  <UniversityProfileForm
                    program="graduate"
                    onSubmit={handleGraduateSubmit}
                    key="grad-form"
                  />
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <UniversityProfileForm
              program="undergraduate"
              onSubmit={handleUndergraduateSubmit}
              key="undergrad-only-form"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
