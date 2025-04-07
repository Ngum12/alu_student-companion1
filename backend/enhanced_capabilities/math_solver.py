import re
import sympy
from sympy import symbols, solve, simplify, expand, factor, integrate, diff
from typing import Dict, Any, List, Tuple

def is_math_question(question: str) -> bool:
    """
    Determine if a question is likely a math problem.
    
    Args:
        question: The user's question
        
    Returns:
        True if it appears to be a math question
    """
    # Convert to lowercase for case-insensitive matching
    question_lower = question.lower()
    
    # IMPORTANT: Check for numbers and math operators first
    # This prevents non-math questions from being misidentified
    has_math_elements = bool(re.search(r'[0-9+\-*/^=()]', question_lower))
    if not has_math_elements:
        return False
    
    # Keywords often found in math questions
    math_keywords = [
        "solve", "calculate", "evaluate", "find", "compute", "derive", "simplify", 
        "factor", "expand", "integrate", "differentiate", "equation", "expression",
        "polynomial", "function", "graph", "plot", "value", "=", "+", "-", "*", "/",
        "sqrt", "square", "cube", "sum", "difference", "product", "quotient", "remainder"
    ]
    
    # Check for math keywords (with the added security that we already have math symbols)
    for keyword in math_keywords:
        if keyword in question_lower:
            return True
    
    # If we have math symbols but no specific keywords, do a more thorough check
    # for mathematical patterns
    math_patterns = [
        r"\d+\s*[\+\-\*\/\^\=]\s*\d+",  # Basic operations: 3 + 4, 5*6
        r"[xyz]\s*[\+\-\*\/\^\=]\s*\d+", # Variables with operations: x + 5
        r"\d+\s*[\+\-\*\/\^\=]\s*[xyz]", # Operations with variables: 5 + x
        r"solve\s+for\s+[xyz]",       # "Solve for x"
        r"find\s+[xyz]",              # "Find x"
    ]
    
    for pattern in math_patterns:
        if re.search(pattern, question_lower):
            return True
    
    # Default: if we have numbers and operators but no specific patterns,
    # assume it might be a math question
    return has_math_elements and ("+" in question_lower or "-" in question_lower or 
                                 "*" in question_lower or "/" in question_lower or
                                 "=" in question_lower)

def solve_math_problem(question: str) -> Tuple[str, List[str]]:
    """
    Solve a math problem using symbolic computation.
    
    Args:
        question: The math question
        
    Returns:
        Tuple of (answer, steps)
    """
    # Clean up the question
    question = question.strip()
    
    # Extract the actual equation or expression
    math_expr = extract_math_expression(question)
    
    try:
        # Convert to sympy expression
        expr = sympy.sympify(math_expr)
        
        # If it's an equation (contains =), solve it
        if '=' in math_expr:
            left, right = math_expr.split('=')
            left = sympy.sympify(left)
            right = sympy.sympify(right)
            
            # Move all terms to left side
            equation = left - right
            
            # Get the variables
            variables = list(equation.free_symbols)
            if not variables:
                return "No variables found to solve for.", []
            
            # Solve for the first variable
            var = variables[0]
            solutions = sympy.solve(equation, var)
            
            # Format the solution
            result = f"{var} = {', '.join(map(str, solutions))}"
            
            # Generate steps
            steps = generate_solving_steps(math_expr, var, solutions)
            
            return result, steps
        else:
            # Just evaluate the expression
            result = sympy.N(expr)
            
            # Generate steps
            steps = [
                f"Evaluating expression: {math_expr}",
                f"Result: {result:.14f}"
            ]
            
            return f"Result: {result:.14f}", steps
            
    except Exception as e:
        return f"Error solving math problem: {str(e)}", []

def extract_math_expression(question: str) -> str:
    """Extract the mathematical expression from a text question."""
    # Remove common phrases around math problems
    phrases_to_remove = [
        "solve", "calculate", "evaluate", "find", "compute",
        "what is", "result of", "value of", "solve for"
    ]
    
    cleaned = question.lower()
    for phrase in phrases_to_remove:
        cleaned = cleaned.replace(phrase, "")
    
    # Extract the expression using regex
    expr_patterns = [
        r"([\w\+\-\*\/\^\=\(\)\s\.]+)",  # General expression pattern
        r"([a-zA-Z0-9\+\-\*\/\^\=\(\)\s\.]+)" # Another pattern
    ]
    
    for pattern in expr_patterns:
        match = re.search(pattern, cleaned)
        if match:
            expr = match.group(1).strip()
            return expr
    
    # If no clear match, return the cleaned string
    return cleaned.strip()

def generate_solving_steps(equation: str, var, solutions) -> List[str]:
    """Generate human-readable steps for solving an equation."""
    steps = []
    
    # Start with the original equation
    steps.append(f"Original equation: {equation}")
    
    # Rearranging to standard form
    parts = equation.split("=")
    if len(parts) == 2:
        left, right = parts
        steps.append(f"Rearranging to standard form: {left} - ({right}) = 0")
    
    # Show the solutions
    steps.append(f"Solving for {var}: {var} = {', '.join(map(str, solutions))}")
    
    # Verification step
    eq_with_solution = equation.replace(str(var), f"({solutions[0]})")
    steps.append(f"Verification: Substituting {var} = {solutions[0]} into the original equation")
    
    return steps

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