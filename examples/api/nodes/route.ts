import { NextResponse } from 'next/server';

const API_URL = process.env.NODE_API_URL;

/**
 * GET /api/nodes
 * Fetches all IPFS nodes
 */
export async function GET() {
  try {
    const response = await fetch(`${API_URL}/nodes`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch nodes: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nodes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/nodes
 * Adds a new IPFS node
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }
    
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('url', url);
    
    const response = await fetch(`${API_URL}/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add node: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding node:', error);
    return NextResponse.json(
      { error: 'Failed to add node' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/nodes/[id]
 * Deletes a node by ID
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Node ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const response = await fetch(`${API_URL}/nodes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete node: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json(
      { error: 'Failed to delete node' },
      { status: 500 }
    );
  }
} 