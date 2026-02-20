import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButton } from './ExportButton';
import * as exportLib from '@/lib/export';
import * as tracker from '@/lib/tracker';

jest.mock('@/lib/export');
jest.mock('@/lib/tracker');

const mockDownloadCSV = jest.mocked(exportLib.downloadCSV);
const mockDownloadJSON = jest.mocked(exportLib.downloadJSON);
const mockTrack = jest.mocked(tracker.track);

beforeEach(() => {
  mockDownloadCSV.mockResolvedValue(undefined);
  mockDownloadJSON.mockResolvedValue(undefined);
  mockTrack.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ExportButton', () => {
  it('renders both export buttons', () => {
    render(<ExportButton />);
    expect(screen.getByTestId('export-csv-btn')).toBeInTheDocument();
    expect(screen.getByTestId('export-json-btn')).toBeInTheDocument();
    expect(screen.getByText('Exportar CSV')).toBeInTheDocument();
    expect(screen.getByText('Exportar JSON')).toBeInTheDocument();
  });

  it('calls downloadCSV with token and filters when CSV button is clicked', async () => {
    const filters = { componentName: 'Button', projectId: 'proj-1' };
    render(<ExportButton token="my-token" filters={filters} />);

    fireEvent.click(screen.getByTestId('export-csv-btn'));

    await waitFor(() =>
      expect(mockDownloadCSV).toHaveBeenCalledWith('my-token', filters)
    );
  });

  it('calls downloadJSON with token and filters when JSON button is clicked', async () => {
    const filters = { from: '2024-01-01', to: '2024-12-31' };
    render(<ExportButton token="my-token" filters={filters} />);

    fireEvent.click(screen.getByTestId('export-json-btn'));

    await waitFor(() =>
      expect(mockDownloadJSON).toHaveBeenCalledWith('my-token', filters)
    );
  });

  it('uses empty string as default token when not provided', async () => {
    render(<ExportButton />);
    fireEvent.click(screen.getByTestId('export-csv-btn'));
    await waitFor(() =>
      expect(mockDownloadCSV).toHaveBeenCalledWith('', {})
    );
  });

  it('shows error message when CSV export fails', async () => {
    mockDownloadCSV.mockRejectedValue(new Error('401 Unauthorized'));
    render(<ExportButton />);

    fireEvent.click(screen.getByTestId('export-csv-btn'));

    await waitFor(() =>
      expect(screen.getByTestId('export-error')).toBeInTheDocument()
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows error message when JSON export fails', async () => {
    mockDownloadJSON.mockRejectedValue(new Error('Network error'));
    render(<ExportButton />);

    fireEvent.click(screen.getByTestId('export-json-btn'));

    await waitFor(() =>
      expect(screen.getByTestId('export-error')).toBeInTheDocument()
    );
  });

  it('clears error on a subsequent successful export', async () => {
    mockDownloadCSV
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue(undefined);

    render(<ExportButton />);

    fireEvent.click(screen.getByTestId('export-csv-btn'));
    await waitFor(() => expect(screen.getByTestId('export-error')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('export-csv-btn'));
    await waitFor(() =>
      expect(screen.queryByTestId('export-error')).not.toBeInTheDocument()
    );
  });

  it('disables both buttons while CSV is loading', async () => {
    let resolveExport!: () => void;
    mockDownloadCSV.mockImplementation(
      () => new Promise<void>(r => { resolveExport = r; })
    );

    render(<ExportButton />);
    fireEvent.click(screen.getByTestId('export-csv-btn'));

    await waitFor(() =>
      expect(screen.getByTestId('export-csv-btn')).toBeDisabled()
    );
    expect(screen.getByTestId('export-json-btn')).toBeDisabled();

    resolveExport();
    await waitFor(() =>
      expect(screen.getByTestId('export-csv-btn')).not.toBeDisabled()
    );
  });

  it('disables both buttons while JSON is loading', async () => {
    let resolveExport!: () => void;
    mockDownloadJSON.mockImplementation(
      () => new Promise<void>(r => { resolveExport = r; })
    );

    render(<ExportButton />);
    fireEvent.click(screen.getByTestId('export-json-btn'));

    await waitFor(() =>
      expect(screen.getByTestId('export-json-btn')).toBeDisabled()
    );
    expect(screen.getByTestId('export-csv-btn')).toBeDisabled();

    resolveExport();
    await waitFor(() =>
      expect(screen.getByTestId('export-json-btn')).not.toBeDisabled()
    );
  });

  it('fires mount tracking event on render', () => {
    render(<ExportButton trackingName="MyExport" />);
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({ componentName: 'MyExport', action: 'mount' })
    );
  });

  it('fires csv click tracking event', () => {
    render(<ExportButton trackingName="MyExport" />);
    fireEvent.click(screen.getByTestId('export-csv-btn'));
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        componentName: 'MyExport',
        action: 'click',
        variant: 'csv',
      })
    );
  });

  it('fires json click tracking event', () => {
    render(<ExportButton trackingName="MyExport" />);
    fireEvent.click(screen.getByTestId('export-json-btn'));
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        componentName: 'MyExport',
        action: 'click',
        variant: 'json',
      })
    );
  });

  it('passes projectId to tracking events', () => {
    render(<ExportButton trackingName="MyExport" projectId="project-abc" />);
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'project-abc' })
    );
  });
});
