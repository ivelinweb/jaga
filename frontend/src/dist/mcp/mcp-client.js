"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JagaMCPClient = void 0;
// lib/mcp-client.ts - Fixed MCP Client
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
class JagaMCPClient {
    constructor() {
        // (optional) define a response shape if you want type‑safe parsing
        this.ToolCallResponseSchema = zod_1.z.object({
            content: zod_1.z.array(zod_1.z.object({
                type: zod_1.z.literal("text"),
                text: zod_1.z.string(),
            })),
            isError: zod_1.z.boolean().optional(),
        });
        this.transport = new stdio_js_1.StdioClientTransport({
            command: "node",
            args: ["src/dist/mcp/mcp-server.js"],
        });
        this.client = new index_js_1.Client({
            name: "jaga-client",
            version: "1.0.0",
        }, {
            capabilities: {},
        });
    }
    async connect() {
        try {
            await this.client.connect(this.transport);
            console.log("Connected to Jaga MCP Server");
        }
        catch (error) {
            console.error("Failed to connect to MCP server:", error);
            throw error;
        }
    }
    async getAvailableTools() {
        try {
            const response = (await this.client.request({
                method: "tools/list",
            }, types_js_1.ListToolsRequestSchema));
            return response.tools || [];
        }
        catch (error) {
            console.error("Error fetching available tools:", error);
            throw error;
        }
    }
    async callTool(name, arguments_) {
        try {
            console.log(`Calling tool: ${name} with arguments:`, arguments_);
            const request = {
                method: "tools/call",
                params: {
                    name,
                    arguments: arguments_,
                },
            };
            console.log("Sending payload to MCP server:", JSON.stringify(request, null, 2));
            // 1️⃣  send the request
            const rawResponse = await this.client.request(request, this.ToolCallResponseSchema); // ← schema provided here
            console.log("Raw tool response:", rawResponse);
            // 2️⃣  (optional) validate the *response*
            const parsed = this.ToolCallResponseSchema.safeParse(rawResponse);
            if (!parsed.success) {
                console.warn("Response did not match ToolCallResponseSchema:", parsed.error);
                return rawResponse; // fall back to raw
            }
            return parsed.data; // → { content, isError? }
        }
        catch (error) {
            console.error(`Error calling tool ${name}:`, error);
            throw error;
        }
    }
    async disconnect() {
        try {
            await this.client.close();
            console.log("Disconnected from MCP server");
        }
        catch (error) {
            console.error("Error disconnecting:", error);
            // Don't throw here as we want to ensure cleanup
        }
    }
}
exports.JagaMCPClient = JagaMCPClient;
