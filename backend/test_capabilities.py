from enhanced_capabilities.capability_router import is_math_question  
from enhanced_capabilities.math_solver import solve_math_with_sympy
from enhanced_capabilities.web_lookup import search_web_duckduckgo

# Test cases
test_questions = [
    "What is 2 + 2?",
    "Solve for x: 2x + 5 = 15",
    "Who is the president of the United States?",
    "What is the capital of France?",
    "When is the midterm exam for Biology 101?",
]

def test_math_solver():
    print("Testing math solver...")
    math_questions = [q for q in test_questions if is_math_question(q)]
    for question in math_questions:
        print(f"Question: {question}")
        try:
            result = solve_math_with_sympy(question)
            print(f"Answer: {result.get('answer', 'No answer')}")
            print(f"Steps: {result.get('steps', [])}")
        except Exception as e:
            print(f"Error: {e}")
        print("=" * 50)

def test_web_search():
    print("Testing web search...")
    web_questions = ["Who is the president of the United States?", "What is the capital of France?"]
    for question in web_questions:
        print(f"Question: {question}")
        try:
            result = search_web_duckduckgo(question)
            print(f"Answer: {result.get('answer', 'No answer')}")
            if result.get('links'):
                print(f"First source: {result.get('links')[0]}")
        except Exception as e:
            print(f"Error: {e}")
        print("=" * 50)

if __name__ == "__main__":
    print("Testing enhanced capabilities individually...\n")
    
    test_math_solver()
    print("\n")
    test_web_search()