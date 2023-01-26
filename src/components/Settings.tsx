import { Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

export interface Settings {
  name: string;
  token: string;
}

export const Settings: React.FC<{
  onChange: (settings: Settings) => void;
  value?: Partial<Settings>;
}> = ({ value, onChange }) => {
  const [settings, setSettings] = useState<Settings>({
    name: "",
    token: "",
    ...value,
  });

  useEffect(() => {
    onChange(settings);
  }, [onChange, settings]);

  return (
    <Group>
      <TextInput
        placeholder="Name"
        value={settings.name}
        onChange={(e) => {
          const name = e.target.value;
          setSettings((s) => ({ ...s, name }));
        }}
      />
      <TextInput
        placeholder="Token"
        value={settings.token}
        onChange={(e) => {
          const token = e.target.value;
          setSettings((s) => ({ ...s, token }));
        }}
      />
    </Group>
  );
};
