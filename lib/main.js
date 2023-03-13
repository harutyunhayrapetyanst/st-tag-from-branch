"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameToIdentifier = exports.generate = exports.fetchEnvLabel = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    try {
        let versionTag = fetchEnvLabel();
        if (!versionTag) {
            const branchName = core.getInput('head_ref');
            versionTag = generate(branchName);
        }
        core.setOutput('version_tag', versionTag);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
function fetchEnvLabel() {
    var _a, _b;
    const labels = (_b = (_a = github.context.payload) === null || _a === void 0 ? void 0 : _a.pull_request) === null || _b === void 0 ? void 0 : _b.labels;
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
exports.fetchEnvLabel = fetchEnvLabel;
function generate(branchName) {
    return `qa-${branchName.split('/').at(-1).replace(/-/i, '').toLowerCase()}`;
}
exports.generate = generate;
function nameToIdentifier(name) {
    return name
        .replace(/['"“‘”’]+/gu, '') // remove quotes
        .replace(/[^\p{Letter}\p{Number}]+/gu, '-') // non alphanum to dashes
        .replace(/-+/g, '-') // remove consecutive dashes
        .toLowerCase();
}
exports.nameToIdentifier = nameToIdentifier;
run();
