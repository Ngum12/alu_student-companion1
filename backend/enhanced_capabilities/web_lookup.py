from duckduckgo_search import DDGS
from typing import Dict, List, Any

def search_web_duckduckgo(query: str, max_results: int = 5) -> Dict[str, Any]:
    """
    Search the web using DuckDuckGo.
    
    Args:
        query: The search query
        max_results: Maximum number of results to return
        
    Returns:
        Dict containing:
            - answer: A summary of the search results
            - snippets: List of text snippets from search results
            - links: List of source URLs
    """
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        
        if not results:
            return {
                "answer": "I couldn't find any relevant information on the web for this query.",
                "snippets": [],
                "links": []
            }
        
        # Extract snippets and links
        snippets = [result['body'] for result in results]
        links = [result['href'] for result in results]
        
        # Create a summary from the search results
        summary = f"Based on web search results:\n\n"
        
        for i, snippet in enumerate(snippets[:3]):  # Limit to first 3 for summary
            summary += f"- {snippet[:150]}...\n\n"
        
        summary += f"I found {len(results)} relevant sources. You can check the links for more information."
        
        return {
            "answer": summary,
            "snippets": snippets,
            "links": links
        }
    
    except Exception as e:
        return {
            "answer": f"I encountered an error while searching the web: {str(e)}",
            "snippets": [],
            "links": []
        }