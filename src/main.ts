import * as core from '@actions/core';

function run(): void {
    try {
        const branchName: string = core.getInput('head_ref');
        const versionTag = generate(branchName);
        core.setOutput('versionTag', versionTag);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

export function generate(branchName: string): string {
    return `qa-${branchName.split('/').at(-1)!.replace(/-/i, '').toLowerCase()}`;
}

run();
