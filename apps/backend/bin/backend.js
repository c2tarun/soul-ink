#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const backend_stack_1 = require("../lib/backend-stack");
const frontend_stack_1 = require("../lib/frontend-stack");
const app = new cdk.App();
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};
// Backend stack - Dev environment
new backend_stack_1.BackendStack(app, 'SoulInkBackendDevStack', {
    environment: 'dev',
    env,
    description: 'Dev backend infrastructure for Soul Ink notes app',
});
// Frontend stack - Dev environment
new frontend_stack_1.FrontendStack(app, 'SoulInkDevStack', {
    environment: 'dev',
    env,
    description: 'Dev frontend hosting for Soul Ink notes app',
});
// Frontend stack - Prod environment (commented out for now)
// new FrontendStack(app, 'SoulInkProdStack', {
//   environment: 'prod',
//   env,
//   description: 'Production frontend hosting for Soul Ink notes app',
// });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQXFDO0FBQ3JDLGlEQUFtQztBQUNuQyx3REFBb0Q7QUFDcEQsMERBQXNEO0FBRXRELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sR0FBRyxHQUFHO0lBQ1YsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO0lBQ3hDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQjtDQUN2QyxDQUFDO0FBRUYsa0NBQWtDO0FBQ2xDLElBQUksNEJBQVksQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLEVBQUU7SUFDOUMsV0FBVyxFQUFFLEtBQUs7SUFDbEIsR0FBRztJQUNILFdBQVcsRUFBRSxtREFBbUQ7Q0FDakUsQ0FBQyxDQUFDO0FBRUgsbUNBQW1DO0FBQ25DLElBQUksOEJBQWEsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7SUFDeEMsV0FBVyxFQUFFLEtBQUs7SUFDbEIsR0FBRztJQUNILFdBQVcsRUFBRSw2Q0FBNkM7Q0FDM0QsQ0FBQyxDQUFDO0FBRUgsNERBQTREO0FBQzVELCtDQUErQztBQUMvQyx5QkFBeUI7QUFDekIsU0FBUztBQUNULHVFQUF1RTtBQUN2RSxNQUFNO0FBRU4sR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEJhY2tlbmRTdGFjayB9IGZyb20gJy4uL2xpYi9iYWNrZW5kLXN0YWNrJztcbmltcG9ydCB7IEZyb250ZW5kU3RhY2sgfSBmcm9tICcuLi9saWIvZnJvbnRlbmQtc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBlbnYgPSB7XG4gIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OLFxufTtcblxuLy8gQmFja2VuZCBzdGFjayAtIERldiBlbnZpcm9ubWVudFxubmV3IEJhY2tlbmRTdGFjayhhcHAsICdTb3VsSW5rQmFja2VuZERldlN0YWNrJywge1xuICBlbnZpcm9ubWVudDogJ2RldicsXG4gIGVudixcbiAgZGVzY3JpcHRpb246ICdEZXYgYmFja2VuZCBpbmZyYXN0cnVjdHVyZSBmb3IgU291bCBJbmsgbm90ZXMgYXBwJyxcbn0pO1xuXG4vLyBGcm9udGVuZCBzdGFjayAtIERldiBlbnZpcm9ubWVudFxubmV3IEZyb250ZW5kU3RhY2soYXBwLCAnU291bElua0RldlN0YWNrJywge1xuICBlbnZpcm9ubWVudDogJ2RldicsXG4gIGVudixcbiAgZGVzY3JpcHRpb246ICdEZXYgZnJvbnRlbmQgaG9zdGluZyBmb3IgU291bCBJbmsgbm90ZXMgYXBwJyxcbn0pO1xuXG4vLyBGcm9udGVuZCBzdGFjayAtIFByb2QgZW52aXJvbm1lbnQgKGNvbW1lbnRlZCBvdXQgZm9yIG5vdylcbi8vIG5ldyBGcm9udGVuZFN0YWNrKGFwcCwgJ1NvdWxJbmtQcm9kU3RhY2snLCB7XG4vLyAgIGVudmlyb25tZW50OiAncHJvZCcsXG4vLyAgIGVudixcbi8vICAgZGVzY3JpcHRpb246ICdQcm9kdWN0aW9uIGZyb250ZW5kIGhvc3RpbmcgZm9yIFNvdWwgSW5rIG5vdGVzIGFwcCcsXG4vLyB9KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=