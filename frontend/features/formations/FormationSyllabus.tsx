"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type FormationSyllabusProps = {
  modules: { title: string; description: string }[];
};

export function FormationSyllabus({ modules }: FormationSyllabusProps) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {modules.map((module, index) => {
        const value = `module-${index + 1}`;

        return (
          <Accordion.Item
            key={value}
            value={value}
            className="overflow-hidden rounded-xl border border-border bg-white"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-foreground sm:px-5 sm:text-base">
                <span>{module.title}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5">
              {module.description}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
