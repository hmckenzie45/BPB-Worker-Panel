/**
 * EdgeOne Pages Edge Functions Entry Point
 * 
 * This file uses dynamic routing [[path]] to catch all requests for BPB Worker Panel.
 * EdgeOne Pages uses file-based routing under /edge-functions directory.
 * 
 * Dynamic Route: [[path]].js catches all paths except root (/)
 * Platform: EdgeOne Pages (pages.edgeone.ai)
 * 
 * Route Matching Examples:
 * - /panel -> ✅ Matches
 * - /sub/normal/abc -> ✅ Matches
 * - /login -> ✅ Matches
 * - /api/any/path -> ✅ Matches
 */

// Import the compiled worker
// The worker is built as an ES module with a default export containing fetch()
import worker from '../dist/worker.js';

/**
 * EdgeOne Pages onRequest Handler
 * 
 * This handler matches all HTTP methods (GET, POST, PUT, DELETE, etc.)
 * 
 * @param {EventContext} context - EdgeOne Pages event context
 * @param {Request} context.request - The incoming HTTP request
 * @param {Object} context.env - Environment variables and bindings (KV, etc.)
 * @param {Object} context.params - Dynamic route parameters (e.g., params.path)
 * @param {Function} context.next - Function to call next middleware
 * @param {Object} context.data - Shared data between middlewares
 * @param {Function} context.waitUntil - Extend function lifecycle
 * @returns {Response|Promise<Response>} HTTP response
 */
export async function onRequest(context) {
  try {
    // Extract request and environment from EdgeOne Pages context
    const { request, env, params, waitUntil } = context;
    
    // Log the matched path for debugging (optional)
    // console.log('EdgeOne Pages Route:', params.path);
    
    // Call the BPB Worker Panel's fetch handler
    // The worker exports { fetch(request, env) }
    // EdgeOne Pages env object is compatible with Cloudflare Workers env
    const response = await worker.fetch(request, env);
    
    return response;
  } catch (error) {
    // Handle any errors gracefully
    console.error('EdgeOne Pages Function Error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
  }
}

// Note: We use onRequest to handle all HTTP methods.
// EdgeOne Pages also supports method-specific handlers:
// - onRequestGet(context) for GET requests
// - onRequestPost(context) for POST requests
// - onRequestPut(context) for PUT requests
// - onRequestDelete(context) for DELETE requests
// - onRequestPatch(context) for PATCH requests
// - onRequestHead(context) for HEAD requests
// - onRequestOptions(context) for OPTIONS requests
