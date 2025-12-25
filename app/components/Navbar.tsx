import { Burger, Button, Container, Drawer, Group, Image, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router";

const navLinks = [
  { label: "Formulaire", to: "/" },
  { label: "Sessions", to: "/sessions" },
];

export const Navbar = () => {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);

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
                {link.label}
              </Button>
            ))}
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
              {link.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </header>
  );
};
