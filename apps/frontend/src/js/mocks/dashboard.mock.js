const dashboardMock = {
    globalMetrics: {
        codersRequestingLastWeek: 18, 
        completionRate: 65.5,       
        pendingRate: 22.2,          
        cancellationRate: 12.3       
    },
    
    sessionsVolumeReport: {
        completedCount: 66,
        pendingCount: 22,
        cancelledCount: 12,
        totalSessionsCount: 100
    },
    
    tutorPerformanceReport: [
        { name: "ricardo llanos", sessionsCount: 42, totalHours: 84, averageRating: 4.9 },
        { name: "juan cañas", sessionsCount: 26, totalHours: 52.5, averageRating: 4.7 },
        { name: "roberto martinez", sessionsCount: 21, totalHours: 42, averageRating: 4.4 },
        { name: "Neyder Villareal", sessionsCount: 12, totalHours: 24, averageRating: 3.8 }
    ]
};

export default dashboardMock;