import { Foundation } from "@expo/vector-icons";
import * as DropdownMenu from "zeego/dropdown-menu";

export function Menu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Foundation
          name="pencil"
          size={50}
          color="black"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/* <DropdownMenu.Label>awda</DropdownMenu.Label> */}
        <DropdownMenu.Item key="delete">
          <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "trash" }} />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
