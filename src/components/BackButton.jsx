import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button className="back-button glass" onClick={() => navigate('/')}>
            <ArrowLeft size={32} strokeWidth={3} />
        </button>
    );
};

export default BackButton;
