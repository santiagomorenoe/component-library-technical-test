/**
 * Integration tests: verify that component interactions produce the correct
 * HTTP requests to the tracking API endpoint.
 *
 * These tests do NOT mock @/lib/tracker — they let the real tracker run
 * and mock global.fetch instead to capture actual network calls.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { Button } from './Button/Button';

const EXPECTED_URL = 'http://localhost:4000/api/components/track';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true, id: 'mock-id' }),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Tracking Integration', () => {
  it('sends a POST request to the track endpoint on Button mount', async () => {
    render(<Button trackingName="IntegrationButton">Click</Button>);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        EXPECTED_URL,
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('includes correct componentName in the request body on mount', async () => {
    render(<Button trackingName="MyComponent">Click</Button>);

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(options.body as string);
      expect(body.componentName).toBe('MyComponent');
    });
  });

  it('sends mount action on first render', async () => {
    render(<Button trackingName="ActionTest">Click</Button>);

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(options.body as string);
      expect(body.action).toBe('mount');
    });
  });

  it('sends a click event when Button is clicked', async () => {
    render(<Button trackingName="ClickTest">Click me</Button>);

    // Wait for mount event
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      const clickCall = calls.find(([, opts]) => {
        const body = JSON.parse(opts.body as string);
        return body.action === 'click';
      });
      expect(clickCall).toBeDefined();
    });
  });

  it('includes a timestamp in the tracking payload', async () => {
    render(<Button trackingName="TimestampTest">Click</Button>);

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(options.body as string);
      expect(body.timestamp).toBeDefined();
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
    });
  });

  it('does not throw when the tracking API fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    expect(() => {
      render(<Button trackingName="ErrorTest">Click</Button>);
    }).not.toThrow();

    // Component should still be in the DOM
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('sends correct Content-Type header', async () => {
    render(<Button trackingName="HeaderTest">Click</Button>);

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(options.headers).toEqual(
        expect.objectContaining({ 'Content-Type': 'application/json' })
      );
    });
  });
});
