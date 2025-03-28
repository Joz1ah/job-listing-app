import React, { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "components";
import { Button } from "components";
import { Textarea } from "components";
import { InputField } from "components";
import { SuccessModal } from "./SuccessModal";

type Variant = "employer" | "job-hunter";

interface Interview {
  position: string;
  company?: string;
  candidate?: string;
  location: string;
  rating?: number;
  feedback?: string;
}

interface RatingData {
  rating: number;
  feedback: string;
  setShowSuccess: (show: boolean) => void;
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview;
  mode?: "create" | "view";
  variant: Variant;
  onSubmit?: (data: RatingData) => void;
  onViewInterviews?: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  interview,
  mode = "create",
  variant,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (onSubmit) {
      onSubmit({ rating, feedback, setShowSuccess });
    }
    //setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setRating(0);
    setFeedback("");
    onClose();
  };

  const renderStar = (index: number): JSX.Element => {
    const filled =
      mode === "view"
        ? index <= (interview.rating || 0)
        : index <= (hoveredRating || rating);

    return (
      <Star
        key={index}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          filled ? "text-[#F5722E] fill-[#F5722E]" : "text-[#F5722E]"
        }`}
        onMouseEnter={() => mode === "create" && setHoveredRating(index)}
        onMouseLeave={() => mode === "create" && setHoveredRating(0)}
        onClick={() => mode === "create" && setRating(index)}
      />
    );
  };

  const renderInterviewDetails = () => {
    if (variant === "employer") {
      return (
        <>
          <h3 className="text-[#263238] text-lg font-bold mb-1">
            {interview.position}
          </h3>
          <p className="text-[#263238] text-sm mb-1">{interview.candidate}</p>
        </>
      );
    }

    return (
      <>
        <h3 className="text-[#263238] text-lg font-bold mb-1">
          {interview.company}
        </h3>
        <p className="text-[#263238] text-sm mb-1">{interview.position}</p>
      </>
    );
  };

  if (mode === "view") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">
            Interview Rating Details
          </DialogTitle>
          <div className="relative bg-white p-6 rounded-lg text-center">
            <h2 className="text-[#FF5722] text-lg font-normal mb-4">
              You rate this interview with:
            </h2>

            <div className="text-4xl font-bold text-[#263238] mb-2">
              {interview.rating?.toFixed(1)}
            </div>

            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  key={index}
                  className={`w-6 h-6 ${
                    index <= (interview.rating || 0)
                      ? "text-[#F5722E] fill-[#F5722E]"
                      : "text-[#F5722E]"
                  }`}
                />
              ))}
            </div>

            <div className="mb-4">
              <InputField label="Feedback" variant="secondary">
              <div className="text-sm text-[#263238] p-4 border-2 border-[#263238] rounded-[10px]">
                {interview.feedback || "No feedback provided"}
              </div>
              </InputField>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen && !showSuccess} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Rate Interview</DialogTitle>
          <div className="relative bg-white p-6 rounded-lg">
            <h2 className="text-[#FF5722] text-xl font-medium mb-2">
              Rate your interview with:
            </h2>

            {renderInterviewDetails()}

            <div className="flex items-center text-sm text-[#263238] mb-6">
              <MapPin className="w-4 h-4 text-[#F5722E] mr-1" />
              Based in {interview.location}
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
            </div>

            <div className="mb-6">
              <InputField label="Feedback" variant="secondary">
                <Textarea
                  value={feedback}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFeedback(e.target.value)
                  }
                  placeholder="Please share your interview experience"
                  className="border-2 border-[#263238]"
                  rows={4}
                />
              </InputField>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!rating}
              className="w-full bg-[#F5722E] text-white hover:bg-[#F5722E]/90 disabled:bg-gray-300"
              type="button"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        variant={variant === "employer" ? "employer" : "job-hunter"}
      />
    </>
  );
};

export { RatingModal };
