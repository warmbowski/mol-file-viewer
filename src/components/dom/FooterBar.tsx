import { Button, Group } from "@mantine/core";
import { SeachPubChem } from "./SeachPubChem";

export function FooterBar() {
  return (
    <Group h="100%" px="md" display="flex" justify="space-between">
      <div>
        <SeachPubChem />
      </div>
      <div>
        <Button>Settings</Button>
      </div>
    </Group>
  );
}
