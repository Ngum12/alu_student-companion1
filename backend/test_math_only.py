from enhanced_capabilities.math_solver import solve_math_with_sympy

# Test cases for math
test_questions = [
    "What is 2 + 2?",
    "Solve for x: 2x + 5 = 15",
    "Simplify (x^2 + 3x - 10) / (x - 2)",
    "Factor x^2 - 4",
]

def test_math_solver():
    print("Testing math solver...")
    for question in test_questions:
        print(f"Question: {question}")
        try:
            result = solve_math_with_sympy(question)
            print(f"Answer: {result.get('answer', 'No answer')}")
            print(f"Steps: {result.get('steps', [])}")
        except Exception as e:
            print(f"Error: {e}")
        print("=" * 50)

if __name__ == "__main__":
    print("Testing math capability...\n")
    test_math_solver()