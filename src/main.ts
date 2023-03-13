import * as core from '@actions/core';
import * as github from '@actions/github';

interface Label {
    color: string;
    default: boolean;
    description: string;
    name: string;
    node_id: string;
    url: string;
}

function run(): void {
    try {
        let versionTag = fetchEnvLabel();
        if (!versionTag) {
            const branchName: string = core.getInput('head_ref');
            versionTag = generate(branchName);
        }

        core.setOutput('version_tag', versionTag);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

export function fetchEnvLabel(): string | undefined {
    const labels: Label[] | undefined = github.context.payload?.pull_request?.labels;

    if (!labels || labels.length === 0) {
        core.info('No Label');
        return undefined;
    }

    for (const label of labels) {
        core.info(`Label Name: ${label.name}`);
        const labelName = nameToIdentifier(label.name);
        core.info(`Label Name 1: ${labelName}`);
        if (labelName.startsWith('env')) {
            return labelName.replace('env-', '');
        }
    }
}

export function generate(branchName: string): string {
    return `qa-${branchName.split('/').at(-1)!.replace(/-/i, '').toLowerCase()}`;
}

export function nameToIdentifier(name: string): string {
    return name
        .replace(/['"“‘”’]+/gu, '') // remove quotes
        .replace(/[^\p{Letter}\p{Number}]+/gu, '-') // non alphanum to dashes
        .replace(/-+/g, '-') // remove consecutive dashes
        .toLowerCase();
}

run();
