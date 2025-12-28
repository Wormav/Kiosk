import {
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Image,
  Menu,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLanguage } from "@tabler/icons-react";
import { Link, useFetcher, useLocation } from "react-router";
import type { Locale } from "~/.server/locale.server";

const navLinks = [
  { label: { fr: "Formulaire", en: "Form" }, to: "/" },
  { label: { fr: "Sessions", en: "Sessions" }, to: "/sessions" },
];

const languages: { value: Locale; label: string; flag: string }[] = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

interface Props {
  locale?: Locale;
}

export const Navbar = ({ locale = "fr" }: Props) => {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const fetcher = useFetcher();

  const currentLang = languages.find((l) => l.value === locale) || languages[0];

  const handleLocaleChange = (newLocale: Locale) => {
    fetcher.submit(
      { locale: newLocale, redirectTo: location.pathname + location.search },
      { method: "post", action: "/set-locale" },
    );
  };

  const LanguageSelector = () => (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Button
          variant="subtle"
          size="sm"
          rightSection={<IconChevronDown size={14} />}
          leftSection={<IconLanguage size={18} />}
        >
          {currentLang.flag} {currentLang.label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {languages.map((lang) => (
          <Menu.Item
            key={lang.value}
            onClick={() => handleLocaleChange(lang.value)}
            style={{
              fontWeight: lang.value === locale ? 600 : 400,
              backgroundColor:
                lang.value === locale
                  ? "var(--mantine-color-gray-1)"
                  : undefined,
            }}
          >
            {lang.flag} {lang.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <header style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}>
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Link to="/">
            <Image src="/meetkiosk_logo.jpeg" alt="Kiosk" h={40} w="auto" />
          </Link>

          {/* Desktop nav */}
          <Group gap="sm" visibleFrom="sm">
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                variant={location.pathname === link.to ? "filled" : "subtle"}
                size="sm"
              >
                {link.label[locale]}
              </Button>
            ))}
            <LanguageSelector />
          </Group>

          {/* Mobile burger */}
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            aria-label="Toggle navigation"
          />
        </Group>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title={<Image src="/meetkiosk_logo.jpeg" alt="Kiosk" h={32} w="auto" />}
        padding="md"
        size="xs"
        position="right"
      >
        <Stack gap="sm">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              variant={location.pathname === link.to ? "filled" : "subtle"}
              fullWidth
              onClick={close}
            >
              {link.label[locale]}
            </Button>
          ))}
          <LanguageSelector />
        </Stack>
      </Drawer>
    </header>
  );
};
