import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const { command } = await request.json();
        
        // Security check - only allow specific Docker commands
        const allowedCommands = [
            'docker ps',
            'docker start ipfs',
            'docker stop ipfs',
            'docker logs ipfs'
        ];

        // Validate command
        if (!allowedCommands.includes(command)) {
            return NextResponse.json(
                { error: 'Command not allowed' },
                { status: 403 }
            );
        }

        // Execute Docker command
        const { stdout, stderr } = await execPromise(command);

        return NextResponse.json({
            output: stdout || stderr
        });

    } catch (error: any) {
        console.error('Docker command error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 