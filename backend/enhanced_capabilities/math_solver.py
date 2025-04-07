import re
import sympy
from sympy import symbols, solve, simplify, expand, factor, integrate, diff
from typing import Dict, Any, List

def extract_math_expression(question: str) -> str:
    """Attempt to extract a mathematical expression from a question."""
    # Try to find text between specific markers like $ or $$
    math_delimiters = re.findall(r'\$(.*?)\$', question)
    if math_delimiters:
        return math_delimiters[0]
    
    # Look for equations with =
    equations = re.findall(r'([0-9+\-*/()=x-z\s^]+)', question)
    if equations:
        return max(equations, key=len).strip()
    
    # Extract anything that looks like math
    expressions = re.findall(r'([0-9+\-*/()x-z\s^]+)', question)
    if expressions:
        return max(expressions, key=len).strip()
    
    return ""

def preprocess_expression(expr_str: str) -> str:
    """
    Preprocess the expression string to make it compatible with sympy.
    - Replace ^ with ** for exponentiation
    - Handle implicit multiplication (e.g., 2x → 2*x)
    """
    # Replace ^ with ** for exponentiation
    expr_str = expr_str.replace('^', '**')
    
    # Handle implicit multiplication like 2x → 2*x
    expr_str = re.sub(r'(\d)([a-zA-Z])', r'\1*\2', expr_str)
    
    return expr_str

def identify_operation(question: str) -> str:
    """Determine what mathematical operation is being requested."""
    question = question.lower()
    
    if any(word in question for word in ["solve", "find", "determine"]):
        if "equation" in question or "=" in question:
            return "solve"
    
    if any(word in question for word in ["simplify", "reduce"]):
        return "simplify"
    
    if any(word in question for word in ["expand", "distribute"]):
        return "expand"
    
    if any(word in question for word in ["factor", "factorize"]):
        return "factor"
    
    if any(word in question for word in ["integrate", "integral"]):
        return "integrate"
    
    if any(word in question for word in ["derivative", "differentiate"]):
        return "differentiate"
    
    # Default if no specific operation is identified
    return "evaluate"

def solve_math_with_sympy(question: str) -> Dict[str, Any]:
    """
    Use SymPy to solve mathematical questions.
    
    Args:
        question: The mathematical question
        
    Returns:
        Dict containing:
            - answer: The solution as a string
            - steps: List of steps taken to solve (if applicable)
    """
    try:
        # Extract the mathematical expression
        expression_str = extract_math_expression(question)
        if not expression_str:
            return {
                "answer": "I couldn't identify a clear mathematical expression in your question.",
                "steps": []
            }
        
        # Identify what operation to perform
        operation = identify_operation(question)
        
        # Define common variables used in algebra
        x, y, z = symbols('x y z')
        
        steps = []
        result = None
        
        # Preprocess the expression
        expression_str = preprocess_expression(expression_str)
        
        # Handle different types of operations
        if operation == "solve":
            if "=" in expression_str:
                try:
                    left, right = expression_str.split("=")
                    left = preprocess_expression(left.strip())
                    right = preprocess_expression(right.strip())
                    expr = sympy.parse_expr(left) - sympy.parse_expr(right)
                    steps.append(f"Rearranging to standard form: {left} - ({right}) = 0")
                except Exception as e:
                    steps.append(f"Error parsing equation: {e}")
                    expr = None
            else:
                try:
                    expr = sympy.parse_expr(expression_str)
                    steps.append(f"Treating expression as equal to zero: {expression_str} = 0")
                except Exception as e:
                    steps.append(f"Error parsing expression: {e}")
                    expr = None
            
            if expr is not None:
                result = solve(expr, x)
                steps.append(f"Solving for x: {result}")
            
        elif operation == "simplify":
            try:
                expr = sympy.parse_expr(expression_str)
                result = simplify(expr)
                steps.append(f"Simplifying expression: {result}")
            except Exception as e:
                steps.append(f"Error simplifying expression: {e}")
            
        elif operation == "expand":
            try:
                expr = sympy.parse_expr(expression_str)
                result = expand(expr)
                steps.append(f"Expanding expression: {result}")
            except Exception as e:
                steps.append(f"Error expanding expression: {e}")
            
        elif operation == "factor":
            try:
                expr = sympy.parse_expr(expression_str)
                result = factor(expr)
                steps.append(f"Factoring expression: {result}")
            except Exception as e:
                steps.append(f"Error factoring expression: {e}")
            
        elif operation == "integrate":
            try:
                expr = sympy.parse_expr(expression_str)
                result = integrate(expr, x)
                steps.append(f"Integrating with respect to x: {result}")
            except Exception as e:
                steps.append(f"Error integrating expression: {e}")
            
        elif operation == "differentiate":
            try:
                expr = sympy.parse_expr(expression_str)
                result = diff(expr, x)
                steps.append(f"Taking derivative with respect to x: {result}")
            except Exception as e:
                steps.append(f"Error differentiating expression: {e}")
            
        else:  # evaluate
            try:
                expr = sympy.parse_expr(expression_str)
                result = expr.evalf()
                steps.append(f"Evaluating expression: {result}")
            except Exception as e:
                steps.append(f"Error evaluating expression: {e}")
        
        # Format the answer
        if result is not None:
            if isinstance(result, list):
                answer = f"Solution: x = {', '.join(str(sol) for sol in result)}"
            else:
                answer = f"Result: {result}"
        else:
            answer = "I couldn't solve this problem."
        
        return {
            "answer": answer,
            "steps": steps
        }
    
    except Exception as e:
        return {
            "answer": f"I encountered an error while solving this math problem: {str(e)}",
            "steps": []
        }