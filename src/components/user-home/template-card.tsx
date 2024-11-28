import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Template } from "@/consts/templates";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createWorkSpaceTemplate } from "@/utils/space-utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function TemplateCard({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    template.name.slice(0, template.name.length - 9) + " workspace"
  ); // to remove the "template" string at the last

  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = () => {
    const { id, update, dismiss } = toast({
      title: "Creating Workspace",
      description: "Please wait..",
      forceMount: true,
    });
    createWorkSpaceTemplate(
      value,
      template,
      () => update({ title: "Creating Spaces and lists..", id }),
      (workSpaceId) => {
        update({
          id,
          title: "Workspace Created",
          description: "Redirecting to workspace..",
          forceMount: undefined,
        });
        setTimeout(() => {
          dismiss();
        }, 3000);
        router.push(`/w/${workSpaceId}/dashboard`);
      },
      (msg) => {
        update({ title: "Error", description: msg, id, forceMount: undefined });
        setTimeout(() => {
          dismiss();
        }, 3000);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="p-4 rounded-lg shadow-md bg-white bg-opacity-40 backdrop-blur-lg hover:bg-gradient-to-br from-purple-100 via-white to-blue-100 hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-40 dark:hover:bg-gray-800 dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-900 hover:shadow-lg cursor-pointer w-[250px] h-full overflow-hidden">
          <h3 className="mb-2 font-medium">{template.name}</h3>
          <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
            {template.description}
          </p>
          <div className="mt-2 mb-1">
            <h4 className="text-sm text-gray-800 font-medium dark:text-gray-500">
              Spaces: {template.spaces.length}
            </h4>
            <ul className="flex flex-wrap gap-1">
              {template.spaces.map((s, i) => (
                <li
                  className="text-xs bg-zinc-200 dark:bg-zinc-900 py-1 px-2 rounded w-fit"
                  key={i}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="w-full sm:w-[600px]">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            id={`template_form_${template.name}`}
            className="flex items-center gap-2 flex-wrap pt-4"
          >
            <Label htmlFor="title" className="flex-shrink-0 font-semibold">
              Workspace Name:
            </Label>
            <Input
              className="flex-grow"
              id="title"
              name="title"
              required
              type="text"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </form>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[300px] overflow-auto">
          {template.spaces.map((space, index) => (
            <div key={index} className="border-b pb-4">
              <h4 className="font-semibold text-gray-800">{space.name}</h4>
              <p className="text-gray-600">{space.description}</p>
              <ul className="mt-2 flex gap-2">
                {space.lists.map((list, i) => (
                  <li
                    key={i}
                    style={{
                      background: list.color && list.color + "33",
                      color: list.color,
                    }}
                    className="text-sm flex-shrink-0 text-gray-500 bg-gray-100 rounded py-1 px-2"
                  >
                    {list.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form={`template_form_${template.name}`}>
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
