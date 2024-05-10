import React, { useEffect } from 'react';

export default function Pagination({ currentPage, setCurrentPage, setLoadedItems, allItems, itemsPerPage }) {
    const lastItemIndex = (currentPage + 1) * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    
    useEffect(() => {
        setLoadedItems(allItems.slice(firstItemIndex, lastItemIndex));
        console.log("First / last index", firstItemIndex, lastItemIndex);
        console.log("Total / Loaded", allItems, allItems.slice(firstItemIndex, lastItemIndex));
    }, [currentPage, allItems])

    const handleNext = () => {
        const nextPage = currentPage + 1;
        if (lastItemIndex < allItems.length) {
            setCurrentPage(nextPage);
        }
        else {
            setCurrentPage(0);
        }
    };

    const handlePrev = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 0) {
            setCurrentPage(prevPage);
        }
    };

    return (
        allItems.length > itemsPerPage ? (
            <div className="pagination-buttons">
                <div className='prevAndNext'>
                    <button disabled={currentPage === 0} onClick={handlePrev}>Prev</button>
                    <button onClick={handleNext}>Next</button>
                </div>
            </div>
        ): null
    );
}
