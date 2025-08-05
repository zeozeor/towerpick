const Step = ({currentStep}) => {
    return (
        <ul className="step">
            <li className={currentStep === 1 ? "active" : ""}>step 1</li>
            <li className={currentStep === 2 ? "active" : ""}>step 2</li>
            <li className={currentStep === 3 ? "active" : ""}>step 3</li>
        </ul>
    );
};

export default Step;
