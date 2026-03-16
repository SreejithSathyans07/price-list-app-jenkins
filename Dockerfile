FROM jenkins/jenkins:lts

USER root

# Install prerequisites and ICU libraries for .NET
RUN apt-get update && \
    apt-get install -y wget curl apt-transport-https gnupg libicu-dev unzip python3 python3-pip

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

# Install Elastic Beanstalk CLI (force reinstall to avoid conflicts)
RUN pip3 install awsebcli --break-system-packages --ignore-installed

# Install .NET SDK 9.0
RUN wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh && \
    chmod +x dotnet-install.sh && \
    ./dotnet-install.sh --channel 9.0 --install-dir /usr/share/dotnet && \
    ln -s /usr/share/dotnet/dotnet /usr/local/bin/dotnet && \
    rm dotnet-install.sh

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Chromium
RUN apt-get install -y chromium chromium-driver

# Set environment variable for Chromium
ENV CHROME_BIN=/usr/bin/chromium

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER jenkins