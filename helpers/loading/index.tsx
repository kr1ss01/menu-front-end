import LoadingIcons from "react-loading-icons";
import Colors from "@/types/colors";

type LoadingSpinnerProps = {
    stroke?: Colors;
    fill?: Colors;
    width?: number;
    height?: number;
};

const LoadingSpinner = ({
    stroke = Colors.black,
    fill = Colors.black,
    width,
    height 
}: LoadingSpinnerProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {(width || height) ?
                <LoadingIcons.SpinningCircles
                    stroke={stroke}
                    fill={fill}
                    height={width ? width : height}
                    width={height ? height : width}
                />
            :
                <LoadingIcons.SpinningCircles stroke={stroke} fill={fill} />
            }
        </div>
    );
}

export default LoadingSpinner;