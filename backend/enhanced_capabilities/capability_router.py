import re
from typing import Dict, Any

# Import the specific capability handlers
from .math_solver import solve_math_with_sympy
from .web_lookup import search_web_duckduckgo
from .general_qa import ask_transformer_model
from .code_support import is_code_question, handle_code_question

def is_school_related(question: str) -> bool:
    """Determine if a question is related to school documents."""
    school_keywords = ["course", "syllabus", "lecture", "class", "professor", 
                      "assignment", "exam", "quiz", "grade"]
    
    return any(keyword.lower() in question.lower() for keyword in school_keywords)

def is_math_question(question: str) -> bool:
    """Determine if a question is mathematical in nature."""
    math_keywords = ["solve", "calculate", "compute", "evaluate", "simplify", 
                    "factor", "expand", "integrate", "differentiate", "derivative", 
                    "equation", "expression", "formula"]
    
    # Check for math symbols
    math_symbols = ["+", "-", "*", "/", "=", "<", ">", "^", "√", "∫", "∑", "≠", "≤", "≥"]
    has_math_symbols = any(symbol in question for symbol in math_symbols)
    
    # Check for numbers with operations
    has_numbers_with_operations = bool(re.search(r'\d+\s*[+\-*/^]\s*\d+', question))
    
    return (any(keyword.lower() in question.lower() for keyword in math_keywords) or 
            has_math_symbols or has_numbers_with_operations)

def is_general_knowledge(question: str) -> bool:
    """Determine if a question is general knowledge that can be answered locally."""
    question_starters = ["what", "who", "when", "where", "why", "how", "which", "did", "is", "are", "can"]
    question_lower = question.lower()
    return any(question_lower.startswith(starter) for starter in question_starters) or any(f" {starter} " in question_lower for starter in question_starters)

def handle_question(question: str, search_school_docs_func=None) -> Dict[str, Any]:
    """
    Route questions to appropriate handler based on content.
    
    Args:
        question: The user's question
        search_school_docs_func: Your existing function for searching school documents
        
    Returns:
        Dict containing:
            - answer: The text response
            - source: Which system generated the answer
            - additional_info: Any supplementary information
    """
    if is_code_question(question):
        try:
            result = handle_code_question(question)
            
            response_text = result["answer"]
            
            if "explanation" in result:
                response_text += "\n\n" + result["explanation"]
                
            if "code" in result and result.get("type") == "generate":
                response_text += f"\n\n```{result.get('language', '')}\n{result['code']}\n```"
                
            if "fixed_code" in result:
                response_text += f"\n\n**Fixed Code:**\n```{result.get('language', '')}\n{result['fixed_code']}\n```"
            
            return {
                "answer": response_text,
                "source": "code_support",
                "additional_info": result
            }
        except Exception as e:
            print(f"Code support error: {e}")
    
    if is_school_related(question) and search_school_docs_func:
        try:
            result = search_school_docs_func(question)
            return {
                "answer": result.get("answer", ""),
                "source": "school_documents",
                "additional_info": result.get("source_documents", [])
            }
        except Exception as e:
            print(f"Error in school docs search: {e}")
    
    if is_math_question(question):
        try:
            result = solve_math_with_sympy(question)
            return {
                "answer": result.get("answer", ""),
                "source": "math_solver",
                "additional_info": result.get("steps", [])
            }
        except Exception as e:
            print(f"Math solver error: {e}")
    
    try:
        results = search_web_duckduckgo(question)
        return {
            "answer": results.get("answer", ""),
            "source": "web_search",
            "additional_info": {
                "snippets": results.get("snippets", []),
                "links": results.get("links", [])
            }
        }
    except Exception as e:
        print(f"Web search error: {e}")
        return {
            "answer": f"I'm sorry, I encountered an error while trying to answer your question: {str(e)}",
            "source": "error",
            "additional_info": {}
        }