import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tags from "../components/Tags";

// Mock the hooks
jest.mock("../hooks/authcontext", () => ({
  useAuth: () => ({
    accessToken: "mock-token"
  })
}));

jest.mock("../hooks/tagsContext", () => ({
  useTags: () => ({
    tags: [
      { text: "Test Tag", color: "#ff0000" },
      { text: "Another Tag", color: "#00ff00" }
    ],
    fetchTags: jest.fn()
  })
}));

// Mock SketchPicker
jest.mock("react-color", () => ({
  SketchPicker: ({ color, onChangeComplete }) => (
    <div data-testid="color-picker">
      <div>Mock Color Picker: {color}</div>
      <button
        onClick={() => onChangeComplete({ hex: "#0000ff" })}
        data-testid="change-color-button"
      >
        Change Color
      </button>
    </div>
  )
}));

global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Tags", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.getItem.mockClear();
  });

  test("renders the component with initial state", () => {
    render(<Tags />);
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Create New Tag")).toBeInTheDocument();
  });

  test('shows input fields when "Create New Tag" is clicked', () => {
    render(<Tags />);
    fireEvent.click(screen.getByText("Create New Tag"));
    expect(screen.getByPlaceholderText("Enter tag name")).toBeInTheDocument();
    expect(screen.getByText("Save Tag")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test('hides input fields when "Cancel" is clicked', () => {
    render(<Tags />);
    fireEvent.click(screen.getByText("Create New Tag"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByPlaceholderText("Enter tag name")
    ).not.toBeInTheDocument();
  });

  test("fetches tags when accessToken is available", async () => {
    // We already have accessToken from the mocked useAuth hook
    // No need to mock localStorage anymore for this test
    const mockFetchTags = jest.fn();

    // Override the useTags mock for this specific test
    jest.spyOn(require("../hooks/tagsContext"), "useTags").mockImplementation(() => ({
      tags: [{ text: "Test Tag", color: "#ff0000" }],
      fetchTags: mockFetchTags
    }));

    render(<Tags />);

    // Verify fetchTags was called when component mounted
    await waitFor(() => {
      expect(mockFetchTags).toHaveBeenCalled();
      expect(screen.getByText("Test Tag")).toBeInTheDocument();
    });
  });

  test("displays tags from the context", () => {
    // Let's ensure our mock is working properly by using a one-time mock implementation
    const mockTags = [
      { text: "Test Tag", color: "#ff0000" },
      { text: "Another Tag", color: "#00ff00" }
    ];

    jest.spyOn(require("../hooks/tagsContext"), "useTags").mockImplementation(() => ({
      tags: mockTags,
      fetchTags: jest.fn()
    }));

    render(<Tags />);

    // Verify both tags are rendered
    mockTags.forEach(tag => {
      // Using getByText with a more flexible matching approach
      expect(screen.getByText((content, element) => {
        return content.includes(tag.text);
      })).toBeInTheDocument();
    });
  });

  test("allows input for new tag name", () => {
    render(<Tags />);
    fireEvent.click(screen.getByText("Create New Tag"));

    const input = screen.getByPlaceholderText("Enter tag name");
    fireEvent.change(input, { target: { value: "New Test Tag" } });

    expect(input.value).toBe("New Test Tag");
  });

  test("shows the color picker when creating a new tag", () => {
    render(<Tags />);
    fireEvent.click(screen.getByText("Create New Tag"));

    expect(screen.getByTestId("color-picker")).toBeInTheDocument();
  });

  test("can change the selected color", () => {
    render(<Tags />);
    fireEvent.click(screen.getByText("Create New Tag"));

    // Initial color should be black
    expect(screen.getByText("Mock Color Picker: #000000")).toBeInTheDocument();

    // Change the color
    fireEvent.click(screen.getByTestId("change-color-button"));

    // Color should update to the new value (#0000ff from our mock)
    expect(screen.getByText("Mock Color Picker: #0000ff")).toBeInTheDocument();
  });

  test("submits a new tag when Save Tag is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { rerender } = render(<Tags />);
    fireEvent.click(screen.getByText("Create New Tag"));

    const input = screen.getByPlaceholderText("Enter tag name");
    fireEvent.change(input, { target: { value: "New Test Tag" } });

    fireEvent.click(screen.getByText("Save Tag"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/tag/create",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token",
          }),
          body: expect.any(String),
        })
      );
    });

    // Verify the body content
    const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(requestBody).toEqual({
      text: "New Test Tag",
      color: expect.any(String),
    });
  });

  test("allows selecting a tag for deletion", () => {
    render(<Tags />);

    // Click on a tag to select it
    fireEvent.click(screen.getByText("Test Tag"));

    // Delete button should appear
    const deleteButton = screen.getByText("×");
    expect(deleteButton).toBeInTheDocument();
  });

  test("handles tag deletion", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Tags />);

    // Click on a tag to select it
    fireEvent.click(screen.getByText("Test Tag"));

    // Click the delete button
    const deleteButton = screen.getByText("×");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/tag/delete",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token",
          }),
          body: JSON.stringify({ text: "Test Tag" }),
        })
      );
    });
  });

  test("clicking on a selected tag unselects it", () => {
    render(<Tags />);

    // Click on a tag to select it
    fireEvent.click(screen.getByText("Test Tag"));

    // Delete button should appear
    expect(screen.getByText("×")).toBeInTheDocument();

    // Click on the same tag again
    fireEvent.click(screen.getByText("Test Tag"));

    // Delete button should disappear
    expect(screen.queryByText("×")).not.toBeInTheDocument();
  });
});
