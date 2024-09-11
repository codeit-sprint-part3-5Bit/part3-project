import { Label, TextInput } from "flowbite-react";

export function GroupInput() {
    return(
        <div>
        <div className="mb-2 block">
          <Label htmlFor="base" value="Base input" />
        </div>
        <TextInput id="base" type="text" sizing="md" />
      </div>
    );
}