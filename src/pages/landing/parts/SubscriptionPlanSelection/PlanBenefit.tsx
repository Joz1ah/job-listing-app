type Props = {
  icon: string;
  iconAlt: string;
  text: string;
};

const PlanBenefit = ({ icon, iconAlt, text }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <img src={icon} alt={iconAlt} className="w-6 h-6" />
      <div className="md:text-xs">{text}</div>
    </div>
  );
};

export default PlanBenefit;
