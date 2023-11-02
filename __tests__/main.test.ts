import { expect, test } from '@jest/globals';
import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';
import { generate } from '../src/main';

test('branch name with 0 separator', () => {
    const envName = generate('PT-1111');
    expect(envName).toEqual('pt1111');
});

test('branch name with 1 separator', () => {
    const envName = generate('prod/PT-1111');
    expect(envName).toEqual('pt1111');
});

test('branch name with 2 separator', () => {
    const envName = generate('payroll/prod/PT-1111');
    expect(envName).toEqual('pt1111');
});

test('branch name without dash', () => {
    const envName = generate('payroll/prod/PT1111');
    expect(envName).toEqual('pt1111');
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env.INPUT_MILLISECONDS = '500';
    const np = process.execPath;
    const ip = path.join(__dirname, '..', 'lib', 'main.js');
    const options: cp.ExecFileSyncOptions = {
        env: process.env,
    };
    // eslint-disable-next-line no-console
    console.log(cp.execFileSync(np, [ip], options).toString());
});
