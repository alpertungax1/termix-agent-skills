#!/usr/bin/env node

/**
 * TermiX AACP - Agent to Agent (A2A) Autonomous Commerce Simulator
 * Runs an end-to-end simulation of two AI agents negotiating, escrowing funds,
 * submitting deliverables, and finalizing payments via ERC-8004 & ERC-8183 protocols.
 */

import { createHash, randomBytes } from 'crypto';

// ANSI Terminal Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function printHeader(title) {
  console.log(`\n${colors.cyan}${colors.bright}================================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}  ${title}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}================================================================${colors.reset}\n`);
}

function printStep(stepNum, agentName, role, action) {
  const badge = role === 'CLIENT' ? `${colors.blue}[CLIENT: ${agentName}]${colors.reset}` :
                role === 'PROVIDER' ? `${colors.magenta}[PROVIDER: ${agentName}]${colors.reset}` :
                `${colors.yellow}[PROTOCOL: AACP / ERC-8183]${colors.reset}`;
  console.log(`${colors.bright}Step ${stepNum}:${colors.reset} ${badge} -> ${action}`);
}

async function runA2ASimulation() {
  printHeader('TermiX AACP: Agent-to-Agent (A2A) Commerce Simulation');

  // 1. Setup Agents
  console.log(`${colors.dim}--- Initializing Agent Profiles & Wallets ---${colors.reset}`);
  const clientAgent = {
    id: 401,
    name: 'AlphaHunter-AI',
    address: '0x3A21c8B72fF5E890bDe5C84Fea49B4947C620712',
    balanceUSDC: 500.0,
    reputation: 92,
  };

  const providerAgent = {
    id: 808,
    name: 'SecurityAudit-AI',
    address: '0x9E78229Fa92Cd81a17961A348bEc8a183A925Eb6',
    balanceUSDC: 120.0,
    stakedUSDC: 200.0,
    reputation: 96,
  };

  console.log(`👤 Client: ${colors.green}${clientAgent.name}${colors.reset} (ID: #${clientAgent.id}, Wallet: ${clientAgent.address.slice(0, 10)}..., Balance: ${clientAgent.balanceUSDC} USDC)`);
  console.log(`🤖 Provider: ${colors.magenta}${providerAgent.name}${colors.reset} (ID: #${providerAgent.id}, Wallet: ${providerAgent.address.slice(0, 10)}..., Balance: ${providerAgent.balanceUSDC} USDC, Staked: ${providerAgent.stakedUSDC} USDC)\n`);

  await delay(1000);

  // 2. Step 1: Client creates job and escrows budget
  const jobId = Math.floor(1000 + Math.random() * 9000);
  const jobBudget = 50.0;
  clientAgent.balanceUSDC -= jobBudget;

  printStep(1, clientAgent.name, 'CLIENT', `Creating Job #${jobId} ("Solana/BSC Honeypot & Security Audit")`);
  console.log(`   ${colors.dim}Locking ${jobBudget} USDC into ERC-8183 Escrow contract...${colors.reset}`);
  console.log(`   ${colors.green}✓ Transaction Confirmed! TxHash: 0x${randomBytes(16).toString('hex')}${colors.reset}`);
  console.log(`   ${colors.dim}Client balance: ${clientAgent.balanceUSDC} USDC | Escrow balance: ${jobBudget} USDC${colors.reset}\n`);

  await delay(1200);

  // 3. Step 2: Provider discovers job and submits offer
  const bidAmount = 45.0;
  printStep(2, providerAgent.name, 'PROVIDER', `Discovered open Job #${jobId}. Submitting commercial offer.`);
  console.log(`   ${colors.dim}Offer Details: Price = ${bidAmount} USDC | SLA = 60 seconds | Security Guarantee = Full Slashing backed${colors.reset}`);
  console.log(`   ${colors.green}✓ Offer registered on AACP Registry. Offer ID: #OFFER-9912${colors.reset}\n`);

  await delay(1200);

  // 4. Step 3: Client evaluates offers and assigns Provider
  printStep(3, clientAgent.name, 'CLIENT', `Reviewing offers for Job #${jobId}. Selecting Provider #${providerAgent.id} (${providerAgent.name})`);
  console.log(`   ${colors.dim}Reputation score (96) and stake requirement verified on ERC-8004 registry.${colors.reset}`);
  console.log(`   ${colors.green}✓ Provider #${providerAgent.id} assigned to Job #${jobId}. State changed to [IN_PROGRESS].${colors.reset}\n`);

  await delay(1400);

  // 5. Step 4: Provider conducts audit and submits deliverable
  printStep(4, providerAgent.name, 'PROVIDER', `Executing autonomous security analysis on target token 0x7a25...488d...`);
  console.log(`   ${colors.dim}Analyzing bytecode... Checking honeypot logic... Verifying LP lock status...${colors.reset}`);
  
  const reportPayload = JSON.stringify({
    targetToken: '0x7a25...488d',
    honeypotScore: 0,
    liquidityLocked: true,
    riskScore: 'LOW_RISK',
    timestamp: Date.now(),
  });
  const deliverableHash = '0x' + createHash('sha256').update(reportPayload).digest('hex');
  const deliverableUri = `gnfd://termix-audits/job-${jobId}-report.json`;

  console.log(`   ${colors.dim}Report generated & stored on BNB Greenfield: ${deliverableUri}${colors.reset}`);
  console.log(`   ${colors.green}✓ Deliverable Hash: ${deliverableHash}${colors.reset}`);
  console.log(`   ${colors.green}✓ Deliverable submitted to AACP contract. State changed to [SUBMITTED].${colors.reset}\n`);

  await delay(1500);

  // 6. Step 5: Evaluator & Escrow settlement
  printStep(5, 'AACP Protocol', 'PROTOCOL', `Validating deliverable against rubric rules & resolving Escrow.`);
  const refundAmount = jobBudget - bidAmount;
  providerAgent.balanceUSDC += bidAmount;
  clientAgent.balanceUSDC += refundAmount;
  providerAgent.reputation += 2;

  console.log(`   ${colors.green}✓ Quality Check Passed: 100/100 Points.${colors.reset}`);
  console.log(`   ${colors.green}✓ Escrow Released: ${bidAmount} USDC paid to Provider (${providerAgent.name})${colors.reset}`);
  console.log(`   ${colors.green}✓ Refund Released: ${refundAmount} USDC returned to Client (${clientAgent.name})${colors.reset}`);
  console.log(`   ${colors.green}✓ Provider Reputation updated: ${providerAgent.reputation} (+2 pts)${colors.reset}\n`);

  await delay(800);

  // Final Summary
  printHeader('Simulation Summary & Final Balances');
  console.log(`📊 ${colors.bright}Client (${clientAgent.name}):${colors.reset}`);
  console.log(`   Final Balance: ${colors.green}${clientAgent.balanceUSDC} USDC${colors.reset} (Spent: ${bidAmount} USDC)`);
  console.log(`   Result: Received verified security report [${deliverableUri}]\n`);

  console.log(`📊 ${colors.bright}Provider (${providerAgent.name}):${colors.reset}`);
  console.log(`   Final Balance: ${colors.green}${providerAgent.balanceUSDC} USDC${colors.reset} (Earned: +${bidAmount} USDC)`);
  console.log(`   Reputation: ${colors.cyan}${providerAgent.reputation}/100${colors.reset}\n`);

  console.log(`${colors.green}${colors.bright}🎉 A2A Autonomous Trade Completed Successfully!${colors.reset}\n`);
}

runA2ASimulation().catch(console.error);
