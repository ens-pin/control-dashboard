import { NextResponse } from "next/server";

const API_URL = process.env.NODE_ID_API_URL;

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/nodes/[id]
 * Gets a specific node by ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  const searchParams = new URL(request.url).searchParams;
  const getUsage = searchParams.get("usage") === "true";

  try {
    const response = await fetch(`${API_URL}/nodes/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch node: ${response.status}`);
    }

    const data = await response.json();
    const nodeData = data.node || data;

    if (getUsage) {
      // Return just the usage information if requested
      return NextResponse.json({
        usage: nodeData.usage,
      });
    }

    // Format the response according to the expected output
    const result = {
      message: "Node details",
      node: nodeData,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error fetching node ${id}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch node ${id}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/nodes/[id]
 * Deletes a node by ID
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;

  try {
    const response = await fetch(`${API_URL}/nodes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete node: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error deleting node ${id}:`, error);
    return NextResponse.json(
      { error: `Failed to delete node ${id}` },
      { status: 500 }
    );
  }
}
