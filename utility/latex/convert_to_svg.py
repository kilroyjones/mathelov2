import sys
import ziamath as zm
import matplotlib.pyplot as plt
from matplotlib.transforms import Bbox


from typing import List

def preprocess_latex_string(input_string):
    # Remove the first line and the enclosing LaTeX delimiters
    lines = input_string.split('\n')
    if len(lines) >= 3:
        latex_part = lines[1].strip()
        # Check for and remove the LaTeX delimiters \[ and \]
        if latex_part.startswith(r'\[') and latex_part.endswith(r'\]'):
            return latex_part[2:-2].strip()
    return ""


def latex_to_svg(question, output_file):
    # Split the input into lines
    lines = question.split('\n')
    
    # Prepare figure
    fig, ax = plt.subplots(figsize=(8, 3))  # Smaller height for closer lines
    ax.axis('off')  # Hide the axes
    fig.patch.set_alpha(0.0)  # Make the background of the figure transparent

    # Render non-LaTeX part as text
    non_latex_part = lines[0].strip()
    ax.text(0.5, 0.55, non_latex_part, fontsize=24, va='center', ha='center', color='black', wrap=True)
    
    # Process and render LaTeX part
    if len(lines) > 1 and lines[1].strip().startswith(r'\[') and lines[1].strip().endswith(r'\]'):
        latex_part = lines[1].strip()[2:-2]  # Remove \[ and \]
        ax.text(0.5, 0.35, f'${latex_part}$', fontsize=24, va='center', ha='center', color='black', wrap=True)

    # Save the figure as an SVG
    fig.savefig(output_file, format='svg', bbox_inches='tight', pad_inches=0.1)
    plt.close(fig)


def read_questions_from_file(file_path: str) -> List[str]:
    """
    Reads questions from a given file where each question is separated by an empty line.

    Args:
    - file_path (str): The path to the text file containing the questions.

    Returns:
    - List[str]: A list of questions read from the file.
    """
    questions = []
    current_question = []

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                if line.strip() == '':
                    if current_question:
                        questions.append('\n'.join(current_question).strip())
                        current_question = []
                else:
                    current_question.append(line.strip())

            if current_question:
                questions.append('\n'.join(current_question).strip())

    except FileNotFoundError:
        print(f"Error: The file {file_path} does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

    return questions

def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python script.py <file_path> <output_folder>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    questions = read_questions_from_file(file_path)

    output_path = sys.argv[2]

    # questions = [r'f^\prime(x) = \frac{d}{dx}(3x^3 - 5x + 2)']

    for idx, question in enumerate(questions):
        svg_path = "./{output_path}/{filename}".format(output_path=output_path, filename=str(idx))
        latex_to_svg(question, svg_path)

if __name__ == "__main__":
    main()
