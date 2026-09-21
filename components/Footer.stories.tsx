import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Footer from './Footer';
import fi from '@/content/dictionaries/fi';

const meta = {
  title: 'Osiot/Footer',
  component: Footer,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    docs: {
      description: {
        component:
          'Footer-CTA: display-l vasemmalle, yhteystiedot metana oikealle, vahva viiva yläpuolelle. Sama joka sivulla. Sähköpostiosoite on linkki, ei painike — se on ainoa toiminto jota footerilta odotetaan.',
      },
    },
  },
  args: { dict: fi },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};
export const Tumma: Story = { globals: { theme: 'dark' } };
export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };
