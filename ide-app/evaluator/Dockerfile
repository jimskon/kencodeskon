FROM python:3
     
# Install GCC toolchain
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
       g++ \
       tree \
    && rm -rf /var/lib/apt/lists/*


# (Optional) switch to non-root user for safety
RUN useradd --create-home appuser
USER appuser

# Set workdir if you like
WORKDIR /home/appuser

CMD ["bash"]