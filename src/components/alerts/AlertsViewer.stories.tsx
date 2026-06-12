import type { Meta, StoryObj } from '@storybook/react-vite';
import AlertsViewer from './AlertsViewer';
import alertMocks from './alert-mock.json';

const meta = {
  title: 'Components/AlertsViewer',
  component: AlertsViewer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertsViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    alerts: [],
  },
};

export const WithAlerts: Story = {
  args: {
    alerts: alertMocks
  },
};

export const SingleAlert: Story = {
  args: {
    alerts: [alertMocks[0]]
  },
};

// TODO: add a story for expired alerts once API is done.
/* export const ExpiredAlert: Story = {
  args: {
    alerts: [alertMocks[2]]
  },
}; */
