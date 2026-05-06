import numpy as np
from scipy.integrate import odeint
from typing import List, Dict, Any

def deriv(y: tuple, t: np.ndarray, N: int, beta: float, gamma: float) -> tuple:
    """
    The SIR model differential equations.
    """
    S, I, R = y
    dSdt = -beta * S * I / N
    dIdt = beta * S * I / N - gamma * I
    dRdt = gamma * I
    return dSdt, dIdt, dRdt

def generate_sir_data(population: int, r0: float, infectious_period: int = 14, days: int = 100) -> List[Dict[str, Any]]:
    """
    Generates time-series data for the SIR graph.
    """
    N = population
    I0, R0 = 1, 0  # Start with exactly 1 infected person
    S0 = N - I0 - R0
    
    # Calculate transmission rate (beta) and recovery rate (gamma)
    gamma = 1.0 / infectious_period
    beta = r0 * gamma
    
    # Time grid (in days)
    t = np.linspace(0, days, days)
    
    # Initial conditions vector
    y0 = S0, I0, R0
    
    # Integrate the SIR equations over the time grid
    ret = odeint(deriv, y0, t, args=(N, beta, gamma))
    S, I, R = ret.T
    
    # Format the payload for the frontend charts
    simulation_results = []
    for day in range(days):
        simulation_results.append({
            "day": day,
            "susceptible": round(float(S[day]), 2),
            "infected": round(float(I[day]), 2),
            "recovered": round(float(R[day]), 2)
        })
        
    return simulation_results
